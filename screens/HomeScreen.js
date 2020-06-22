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
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import theme from '../styles/theme.style.js';
import AssessmentScreen from '../screens/AssessmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createStackNavigator } from 'react-navigation-stack';
import CustomIcon from '../components/CustomIcon.js';
import { registerRootComponent, AppLoading } from 'expo';
import ContentModule from '../components/ContentModule';
import WeekBar from '../components/WeekBar';
import {textStyle} from '../styles/text.style.js';
import ProgressBar from '../components/ProgressBar';
import ModuleProgressBar from '../components/ModuleProgressBar';
import { SafeAreaView } from 'react-navigation';
import host from '../constants/Server.js';
import { _getAuthTokenUserId } from '../constants/Helper.js'



const { width } = Dimensions.get('window');
const mainPadding = 40;
var originalFetch = require('isomorphic-fetch');
var fetch = require('fetch-retry')(originalFetch);

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}


export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollBarValue: new Animated.Value(0),
      assessmentNotif: false, // toggle to determine whether assessment is ready
      initialAssessReady: true,
      initialAssessTaken: false,
      recommendedArea:"",
      recommendedBehaviors:[],

    };
  }

  async fetchHomeInfo(){

    const {authToken, userId} = await _getAuthTokenUserId()
    //Get Streak
    console.log("!!!!" + 'http://' + host +':3000/streak/' + userId + '/' + authToken)

    fetch('http://' + host +':3000/streak/' + userId + '/' + authToken,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.navigation.setParams({
        streak: responseJson.streak,
      });
    })
    .catch((error) => {
      console.error(error);
    });

    //Get Recommended Area and Behaviors
    let recArea = 0;
    console.log('http://' + host +':3000/recommendedArea/' + userId + '/' + authToken)
    fetch('http://' + host +':3000/recommendedArea/' + userId + '/' + authToken,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        recommendedArea: responseJson.area_name,
      });
      console.log(responseJson.area_id)
      recArea = responseJson.area_id

          console.log('http://' + host +':3000/currentBehaviors/' + userId + '/' + authToken)
          fetch('http://' + host +':3000/currentBehaviors/' + userId + '/' + authToken,{
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              recommendedBehaviors: JSON.parse(responseJson.behaviors_completed),
            });
            console.log("recommendedBehaviors" + responseJson.behaviors_completed)
          })
          .catch((error) => {
            console.error(error);
          });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  async componentDidMount(){
    //find initialAssessTaken

    const {authToken, userId} = await _getAuthTokenUserId()
    let initialAssessTaken = false

    //Get whether user finished initial assessment
    fetch('http://'+host+':3000/finishedInitial/' + userId + '/' + authToken,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({initialAssessTaken:responseJson.finished_initial});
      this.props.navigation.setParams({
        initialAssessTaken: responseJson.finished_initial,
      });
      this.setState({initialAssessReady:true});

      if(responseJson.finished_initial){
        this.fetchHomeInfo()
      }
    })
    .catch((error) => {
      console.error(error)
    });







  }

  _moveScrollBar = (event) => {
    Animated.timing(this.state.scrollBarValue, {
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/2,
      duration: 0
    }).start();

  };

  async initialAssessComplete(){
    console.log('initialAssessComplete')
    this.setState({initialAssessTaken: true});
    this.props.navigation.setParams({
      initialAssessTaken: true,
    });
    //update in database

    const {authToken, userId} = await _getAuthTokenUserId();

    const data = {
      userId: userId,
      authToken:authToken,
    };

    fetch('http://' + host +':3000/finishInitial/',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    this.fetchHomeInfo()
  }

  async routineAssessComplete(){
    //TODO
  }

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

    let moduleWidth = 320
    let moduleSpace = 10 // space between modules

    let moduleMargin = width/2 - moduleWidth/2
    let snapToInterval = moduleWidth+moduleSpace;

    const scrollX = new Animated.Value(0)

    console.log("recommendedBehaviors2" + this.state.recommendedBehaviors)

    return (
      <View style={styles.container}>
            <View style={styles.welcomeContainer}>
              <View style = {[styles.moduleBar, {marginLeft: moduleMargin, marginRight: moduleMargin}]}>
                <ModuleProgressBar style={styles.progressBar}
                                   length={Object.keys(this.state.recommendedBehaviors).length + 1}
                                   scrollX={scrollX}
                                   snapToInterval={snapToInterval}
                />
                <Text style={styles.levelContainer}>lv 1</Text>
              </View>
              <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.contentContainer,{paddingLeft: (moduleMargin - moduleSpace/2), paddingRight: (moduleMargin - moduleSpace/2)}]}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={snapToInterval}
                snapToAlignment={"center"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: scrollX
                        }
                      }
                    }
                  ])}
                  scrollEventThrottle={1}
                >

                {
                  this.state.recommendedBehaviors!=null?
                  Object.keys(this.state.recommendedBehaviors).map((key, index) => {
                    console.log("key" + Object.keys(this.state.recommendedBehaviors))
                    const opacity = scrollX.interpolate({
                      inputRange: [
                        snapToInterval * (index - 1),
                        snapToInterval * index,
                        snapToInterval * (index + 1)
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: "clamp"
                    });

                    return(
                    <ContentModule
                               title = {this.state.recommendedBehaviors[key].name}
                               subtitle = {this.state.recommendedArea.toUpperCase()}
                               key={index}
                               onPress={() => this.props.navigation.navigate('Assessment',{behaviorId:key, assessmentType:'routine',assessmentComplete:this.initialAssessComplete.bind(this)})}
                               onPress2 = {() => this.props.navigation.navigate('Assessment',{behaviorId:key, assessmentType:'routine',assessmentComplete:this.initialAssessComplete.bind(this)})}
                               behaviorId={key}
                               style = {{}}
                               width = {moduleWidth}
                               space = {moduleSpace}
                               imageOpacity = {opacity}
                               contentType= {'learn'}
                    />)
                  })
                  :null
                }
                <ContentModule title = 'Checkpoint'
                               subtitle = {this.state.recommendedArea.toUpperCase()}
                               onPress={() => this.props.navigation.navigate('Assessment',{assessmentType:'review',assessmentComplete:this.initialAssessComplete.bind(this)})}
                               width = {moduleWidth}
                               space = {moduleSpace}
                               behaviors = {this.state.recommendedBehaviors}
                               contentType= {'check'}

                />

              </ScrollView>
            </View>
          </View>
    );

  }

  render() {
    return this.state.initialAssessReady ? (this.state.initialAssessTaken ? this.getHome() : this.getInitialAssess()):null ;
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
                                      onPress={()=> navigation.navigate('Profile')}>
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
                      <Text style={[{marginLeft:7, color:theme.TEXT_COLOR, alignSelf:'center', opacity: 0.5}, textStyle.label]}>lv ?</Text>
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
    marginBottom: 5,
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
