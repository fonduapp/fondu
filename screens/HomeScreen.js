import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  AsyncStorage,
  AppState,
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import theme from '../styles/theme.style.js';
import AssessmentScreen from '../screens/AssessmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';
import CustomIcon from '../components/CustomIcon.js';
import { registerRootComponent, AppLoading } from 'expo';
import ContentModule from '../components/ContentModule';
import WeekBar from '../components/WeekBar';
import {textStyle} from '../styles/text.style.js';
import ProgressBar from '../components/ProgressBar';
import ModuleProgressBar from '../components/ModuleProgressBar';
import { SafeAreaView } from 'react-navigation';
import Loader from '../components/Loader';
import fetch from '../utils/Fetch';
import invariant from 'invariant';

const { width } = Dimensions.get('window');
const mainPadding = 40;

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}


export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assessmentNotif: false, // toggle to determine whether assessment is ready
      initialAssessReady: true,
      initialAssessTaken: false,
      recommendedArea:"",
      recommendedBehaviors:[],
      loading: true,
      unlockReview: false,
      paired: false,
    };

    this.learningAssessComplete.bind(this)
  }

  fetchHomeInfo(){
    const streakFetch = fetch('GET', 'streak', { currentDate: this.getDate() })
      .then((responseJson) => {
        this.props.navigation.setParams({
          streak: responseJson.streak,
        });
      })
      .catch(console.error);

    //Get Recommended Area
    let recArea = 0;
    const recAreaFetch = fetch('GET', 'recommendedArea')
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          recommendedArea: responseJson.area_name,
        });
        recArea = responseJson.area_id


        //Get Area Level
        return fetch('GET', 'areaLevel', { areaId: recArea })
          .then((responseJson) => {
            this.setState({
              areaLevel: responseJson.area_level,
            });
          })
          .catch(console.error);
      })
      .catch(console.error);

    //Get Recommended Behaviors
    const behaviorFetch = fetch('GET', 'currentBehaviors')
      .then((responseJson) => {
        this.setState({
          recommendedBehaviors: JSON.parse(responseJson.behaviors_completed),
        });
      })
      .catch(console.error);

    const assessDateFetch = this.fetchAssessDate();

    const profileInfoFetch = this.fetchProfileInfo()

    Promise.all([
      //streakFetch,
      recAreaFetch,
      behaviorFetch,
      assessDateFetch,
      profileInfoFetch,
    ]).then(() => {
      this.setState({
        loading: false,
      }, this.compareAssessDate);
    });
    

  }

  fetchProfileInfo(){
    const { setParams } = this.props.navigation;

    this.areaLevel = {}

    //relationship level
    const relationshipInfoFetch = fetch('GET', 'getRelationship')
      .then((responseJson) => {
        //set relationship info

        let paired = responseJson.length > 0
        setParams({
            paired: paired,
        });
        this.setState({paired : paired})
        //if empty array, not paired
        if(paired){
          invariant(responseJson.length === 1,
            `Unsupported number of relationships: ${responseJson.length}.`);
          setParams({
            relationshipInfo: responseJson[0],
          });
        }

      })
      .catch(console.error);

    const totalExpFetch = fetch('GET', 'totalExp')
      .then(({ experience }) => {
        setParams({
          totalExp: experience,
        });
      })
      .catch(console.error);

    const expProgressionFetch = fetch('GET', 'getPastWeeks')
      .then(({ individual }) => {
        setParams({
          expProgression: individual,
        });
      })
      .catch(console.error);

    //areas and area level and xp
    const areasFetch = fetch('GET', 'allAreas')
      .then(async (responseJson)=>{
        setParams({
          allAreas: responseJson,
        });

        await Promise.all(
          responseJson.map((area, key)=>
            {
              const areaId = area["area_id"]
              return fetch('GET', 'areaLevel', { areaId })
                .then((responseJson)=> {

                  this.areaLevel[areaId] = responseJson
                })
                .catch(console.error)

            }
          )
        ).then(()=>
          {
            setParams({
              areaLevels: this.areaLevel
            });        
          })

      })
      .catch(console.error);

    const usernameFetch = fetch('GET', 'username')
      .then((responseJson) => {
        setParams({ name: responseJson.username });
      })
      .catch(console.error);

    const emailFetch = fetch('GET', 'email')
      .then((responseJson) => {
        setParams({ email: responseJson.email });
      })
      .catch(console.error);

    return Promise.all([
      relationshipInfoFetch,
      totalExpFetch,
      expProgressionFetch,
      areasFetch,
      usernameFetch,
      emailFetch,
    ]);
  }

  fetchAssessDate() {
    return fetch('GET', 'nextAssessDate')
      .then((responseJson) => {
        const {
          next_assess_date: nextAssessDate,
        } = responseJson;
        // append midnight to parse as local time instead of utc
        this.nextAssessDate = new Date(nextAssessDate + 'T00:00:00'); 
      })
      .catch(console.error);
  }

  componentDidMount(){
    //find initialAssessTaken
    let initialAssessTaken = false

    //Get whether user finished initial assessment
    fetch('GET', 'finishedInitial')
      .then((responseJson) => {
        const {
          finished_initial: finishedInitialDate,
        } = responseJson;
        const finishedInitial = finishedInitialDate !== null;
        this.setState({initialAssessTaken: finishedInitial});
        this.props.navigation.setParams({
          initialAssessTaken: finishedInitial,
        });
        this.setState({initialAssessReady:true});

        if(finishedInitial){
          this.fetchHomeInfo();
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(console.error);

    AppState.addEventListener('change', this.handleAppStateChange);

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.compareAssessDate();
    }
  };

  compareAssessDate() {
    const unlockReview = this.nextAssessDate < new Date();
    this.setState({
      unlockReview,
    }, () => {
      if (unlockReview) {
        this.scroll.scrollTo({ x: width*2 });
      }
    });
  }

  getDate() {
    const date = new Date();
    return `${date.getFullYear()}-${1+date.getMonth()}-${date.getDate()}`;
  }

  setAssessDate() {
    fetch('POST', 'setAssessDate', { dateFinished: this.getDate() });
  }

  initialAssessComplete(){
    this.setState({
      loading: true,
      initialAssessTaken: true,
    });

    this.props.navigation.setParams({
      initialAssessTaken: true,
    });

    //update in database
    fetch('POST', 'finishInitial', { finishDate: this.getDate() });

    this.setAssessDate();

    this.fetchHomeInfo()
  }

  learningAssessComplete(behaviorId){
      fetch('POST', 'completedBehavior', { behaviorId })
        .catch(console.error);

      //update rec behavior
      this.setState(previousState => {
        const recommendedBehaviors = previousState.recommendedBehaviors;
        recommendedBehaviors[behaviorId].completed = true;
        return { recommendedBehaviors };
      });
  }

  reviewAssessComplete = () => {
    this.setAssessDate();
    this.setState({ loading: true });
    this.fetchHomeInfo();
  };

  getInitialAssess() {
    return (
      <TouchableOpacity style = {styles.initialAssessContainer} onPress={() => this.props.navigation.navigate('Assessment',{assessmentType:'initial',assessmentComplete:this.initialAssessComplete.bind(this)})}>
        <Text style= {[textStyle.subheader,{color:'white', opacity: 0.8, marginBottom: 10}]}>Take your first</Text>
        <Text style = {[textStyle.header,{textAlign: 'center', color:'white', marginBottom: 10}]} >Relationship Assessment</Text>
        <TouchableOpacity style = {{flexDirection:'row', alignItems:'center', }}>
          <Icon name='help-outline' color="white"/>
          <Text style= {[textStyle.caption,{color:'white'}]}>What is this?</Text>
        </TouchableOpacity>
        <Icon style = {{marginTop: '20%'}} name='arrow-downward' color="white" size={48}/>
      </TouchableOpacity>
  );
  }

  getHome() {
    const {
      unlockReview,
    } = this.state;

    let moduleWidth = 320
    let moduleSpace = 15 // space between modules

    let moduleMargin = width/2 - moduleWidth/2
    let snapToInterval = moduleWidth+moduleSpace;

    const scrollX = new Animated.Value(0)

    return (
      <View style={styles.container}>
            <View style={styles.welcomeContainer}>
              <View style = {{marginLeft: moduleMargin, marginRight: moduleMargin}}>
                <View style = {styles.moduleBar}>
                  <ModuleProgressBar style={styles.progressBar}
                                     length={this.state.recommendedBehaviors!=null?Object.keys(this.state.recommendedBehaviors).length + 1:0}
                                     scrollX={scrollX}
                                     snapToInterval={snapToInterval}
                  />
                  <Text style={styles.levelContainer}>lv {this.state.areaLevel}</Text>
                </View>
                <Text style={[textStyle.subheader, { color: theme.TEXT_COLOR, opacity: 0.5, paddingLeft: 30 }]}>
                  {this.state.recommendedArea.toUpperCase()}
                </Text>
              </View>
              <Animated.ScrollView
                style={styles.container}
                contentContainerStyle={[styles.contentContainer,{paddingLeft: (moduleMargin - moduleSpace/2), paddingRight: (moduleMargin - moduleSpace/2)}]}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={snapToInterval}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: scrollX
                        }
                      }
                    }
                  ],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={1}
                ref={(node) => this.scroll = node}
                >

                {
                  this.state.recommendedBehaviors!=null?
                  Object.keys(this.state.recommendedBehaviors).map((key, index) => {
                    const opacity = scrollX.interpolate({
                      inputRange: [
                        snapToInterval * (index - 1),
                        snapToInterval * index,
                        snapToInterval * (index + 1)
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: "clamp"
                    });

                    // to get the image in each ContentModule to overlap the next ContentModule,
                    // we wrap the ContentModules in Views with decreasing zIndices N,..., 1, 0
                    const indexFromLengthToOne = (
                      Object.keys(this.state.recommendedBehaviors).length - index
                    );

                    return (
                      <View key={key} style={{ zIndex: indexFromLengthToOne }}>
                        {!this.state.recommendedBehaviors[key].completed
                          ? (
                            <ContentModule
                                       title = {this.state.recommendedBehaviors[key].name}
                                       onPress={() => this.props.navigation.navigate('Assessment',{
                                         behaviorId:key,
                                         assessmentType:'learning',
                                         assessmentComplete:()=>this.learningAssessComplete(key),
                                       })}
                                       behaviorId={key}
                                       style = {{}}
                                       width = {moduleWidth}
                                       space = {moduleSpace}
                                       imageOpacity = {opacity}
                                       contentType= {'learn'}
                            />
                          )
                          : (
                            <ContentModule
                                       title = {this.state.recommendedBehaviors[key].name}
                                       behaviorId={key}
                                       style = {{}}
                                       width = {moduleWidth}
                                       space = {moduleSpace}
                                       imageOpacity = {opacity}
                                       contentType= {'suggest'}
                            />
                          )
                        }
                      </View>
                    );
                  })
                  :null
                }
                <View key="check" style={{ zIndex: 0 /* below all other ContentModules */ }}>
                  <ContentModule title = 'Checkpoint'
                                 onPress={() => this.props.navigation.navigate('Assessment',{
                                   behaviors: Object.keys(this.state.recommendedBehaviors),
                                   assessmentType: 'review',
                                   assessmentComplete: this.reviewAssessComplete,
                                 })}
                                 width = {moduleWidth}
                                 space = {moduleSpace}
                                 behaviors = {this.state.recommendedBehaviors}
                                 contentType= {'check'}
                                 nextAssessDate={this.nextAssessDate}
                                 unlockReview={unlockReview}
                  />
                </View>
              </Animated.ScrollView>
            </View>
          </View>
    );

  }

  render() {
    const { loading } = this.state;
    return (
      <>
        {loading && <Loader/>}
        {this.state.initialAssessReady ? (this.state.initialAssessTaken ? this.getHome() : this.getInitialAssess()):null}
      </>
    );
  }


  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: 'fondu',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTransparent: !navigation.getParam('initialAssessTaken'),
      headerLayoutPreset: 'center',
      headerTitleStyle: {textAlign:"center",
                         flex:1,
                         color: navigation.getParam('initialAssessTaken') ? theme.TEXT_COLOR : '#FFFFFF',
                         fontFamily: 'fredokaone-regular',},
      headerLeft: (
                    <TouchableOpacity style={{marginLeft: 25, borderRadius: 50}}
                                      onPress={()=> navigation.navigate('Profile',{
                                         streak: navigation.getParam('streak'),
                                         allAreas: navigation.getParam('allAreas'),
                                         areaLevels : navigation.getParam('areaLevels'),
                                         relationshipLevel: -1,
                                         paired : navigation.getParam('paired'),
                                         totalExp: navigation.getParam('totalExp'),
                                         expProgression: navigation.getParam('expProgression'),
                                         relationshipInfo: navigation.getParam('relationshipInfo'),
                                         name: navigation.getParam('name'),
                                         email: navigation.getParam('email'),
                                       })}>
                                      <Avatar rounded size = "small" icon={{name: 'person'}}/>
                    </TouchableOpacity>
                  ),
      headerTitleContainerStyle: {
        left: 0,
        right:0,
      },
      headerRight: ( navigation.getParam('initialAssessTaken') ? <View style={{marginRight: 25, flexDirection: 'row'}}>
                      <Image source={require('../assets/images/streak/streak-fire.png')} style={{height: 30, width: 30}}/>
                      <Text style={[{marginLeft:5, color:theme.TEXT_COLOR, alignSelf:'center', opacity: 0.5}, textStyle.label]}>{navigation.getParam('streak')}</Text>
                      {navigation.getParam('paired') ? <Text style={[{marginLeft:7, color:theme.TEXT_COLOR, alignSelf:'center', opacity: 0.5}, textStyle.label]}>lv ?</Text>
                                                    : null
                      }
                      </View>: null
                    )
    }
  };

}




const AppNavigator = createStackNavigator({
  Home:  HomeScreen,
  Assessment: AssessmentScreen,
  Profile: ProfileScreen,
});

const styles = StyleSheet.create({
  textContainer: {
    color: theme.PRIMARY_COLOR,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 5,
  },
  welcomeContainer: {
    marginTop: 10,
    flex:1,
    width: width,
  },
  moduleBar: {
    marginBottom: 20,
    flexDirection: 'row'
  },
  progressBar:{
    flex:7,
    marginRight: 40,
  },
  levelContainer:{
    flex:1,
    textAlign: 'center',
    padding: 10,
    backgroundColor: theme.SECONDARY_COLOR,
    borderRadius: 20,
    color: theme.TEXT_COLOR,
    ...textStyle.label,
  },
  mainHeaderText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.TERTIARY_COLOR,
  },
  mainParagraphText:{
    fontSize: 15,
    color: theme.TERTIARY_COLOR,
  },
  mainImageContainer:{
    width: width/3,
    height:width/3,
    backgroundColor: '#F2F2F2',
    margin: 30,
  },
  initialAssessContainer:{
    backgroundColor: theme.PRIMARY_COLOR_4,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  initialAssessText:{
    color: 'white'
  }

});
