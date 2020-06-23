import React, { Component, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AssessmentQuestions  from '../components/AssessmentQuestions';
import theme from '../styles/theme.style.js';
import { Button, Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import ProgressNavBar from '../components/NavBar';
import {textStyle} from '../styles/text.style.js';
import { _getAuthTokenUserId } from '../constants/Helper.js'
import host from '../constants/Server.js';


const { width } = Dimensions.get('window');


export default class AssessmentScreen extends Component{
    constructor(props){
    super(props)
    const { navigation } = props;
    this.state = {
      screen:'start', // start, quiz, finish, tutorial
      quizFinish : false,
      score: 0,
      progress:0,
      assessmentType: navigation.getParam('assessmentType','none'),// initial, routine, review, relationship, none
      questionDone:false,
      questionRight: false,
      recArea:'nothing',
      behaviorId : navigation.getParam('behaviorId','none'),
    }
    this.assessmentScreen.bind(this);
    navigation.state.params.assessmentComplete.bind(this);

  }
  _startQuiz(){
    this.setState({ screen:'quiz' })
  }
  _quizFinish(score){    
    this.setState({ screen:'finish', score : score })
  }

  _questionFinish(result, check){
    this.setState({questionRight: result})
    this.setState({questionDone:check})
  }

  _updateProgress(progress){

    this.setState({ progress: progress})
  }

  _seeStreaks(){
    this.setState({ screen: 'streak'})
  }

  async _seeResults(){
    const {authToken, userId} = await _getAuthTokenUserId();

    //find recommended area
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
        recArea: responseJson.area_name,
      });
    })
    .catch((error) => {
      console.error(error);
    });

    this.setState({ screen:'result' })
  }

  _exitAssessment(){
    this.props.navigation.state.params.assessmentComplete();
    this.props.navigation.goBack();

  }

  _seeTutorial(){
    this.setState({ screen: 'tutorial'})
  }

  
  assessmentScreen(){
    const { navigation } = this.props
    const scrollX = new Animated.Value(0)

    switch(this.state.screen){
      case 'start':
        
        return (
        <View style={styles.darkContainer}>

          <ProgressNavBar navigation={navigation} color={theme.TEXT_COLOR}/>
          <View style={styles.startScreen}>
              <Image source={require("../assets/images/heart.png")} style={styles.mainImageContainer}/>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon name="access-time" color={theme.TEXT_COLOR} size={17}/>
                <Text style={[{color:theme.TEXT_COLOR, marginBottom:5, marginLeft:5,},textStyle.caption]}>
                  ~15 minutes
                </Text>
              </View>
              <View style={{marginTop: 10, width:'100%'}}>

                <NextButton 
                onPress={() => this._startQuiz()} 
                title="Get Started"/>
                <Text style={[{color:theme.TEXT_COLOR, marginTop: 30},textStyle.subheader]}>
                  Why should I take this assessment?
                </Text>
                <Text style={[{color:theme.TEXT_COLOR, marginTop: 15, lineHeight: 20, opacity: 0.5},textStyle.paragraph]}>
                This purpose of this short assessment is to allow us to 
                better understand your relationship behaviors and relationship 
                health so that we can figure out how to best help you.
                </Text>
              </View>

          </View> 
        </View>
        );

      case 'finish':
        return (
          <View style={styles.darkContainer}>
            <View style={styles.startScreen}>
              <Image
                source={require("../assets/images/heart.png")}
                style={[styles.mainImageContainer, { marginBottom: 0 }]}
              />
              <View width={246/* fit "Congrats..." exactly */}>
                <Text style={[textStyle.header, {color:theme.TEXT_COLOR, textAlign: 'center'}]}>
                  Congrats, you did it!
                </Text>
                <Text style={[textStyle.paragraph,{marginTop: 15, marginBottom: 15, opacity: 0.5}]}>
                  By taking this assessment routinely, we’re able to better assess 
                  your relationship health and behaviors and inform you of healthy 
                  next steps!
                </Text>
              </View>
            </View> 
            <View style={styles.nextButtonContainer}>
              <NextButton 
              onPress={() => this._seeStreaks()} 
              title="NEXT >"/>
            </View>
          </View>
        );

      case 'quiz':
        return (
          <View style={this.state.questionDone ? (this.state.questionRight? styles.correctContainer : styles.incorrectContainer) : styles.darkContainer}>

            <ProgressNavBar color={theme.PRIMARY_COLOR} navigation={navigation} progress={this.state.progress}/>
            <AssessmentQuestions quizFinish={(score) => this._quizFinish(score)}
                                 questionFinish={(result,check) => this._questionFinish(result,check)}
                                 updateProgress={(progress) => this._updateProgress(progress)}
                                 assessmentType = {this.state.assessmentType}
                                 behaviorId = {this.state.behaviorId}
                                 nextButtonContainerStyle={styles.nextButtonContainer}
                                 />
          </View>
        );
      case 'streak':
        setTimeout(this._seeResults.bind(this), 1000);
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <Image source = {require('../assets/images/streak/streak-fire.png')} style={{width: 120, height: 120}}/>
            <Text style={[{marginLeft:70, marginRight:70, marginTop: 40}, textStyle.header,{color:theme.TEXT_COLOR}]}>
                Streak +1
            </Text>
        </View> 
        );
      case 'result':
        const changeBehaviorTextStyle = {
          ...textStyle.caption,
          color: theme.TEXT_COLOR,
          opacity: 0.5,
          alignSelf: 'center',
        };
        const Component = (slideAnim) => (
          <View style={styles.darkContainer}>
            <View style={styles.startScreen} flex={1}>
              <Text style={[textStyle.header, {color:theme.TEXT_COLOR, alignSelf:'flex-start'}]}>
                Your Results
              </Text>
              <Text style={[textStyle.paragraph, {color:theme.TEXT_COLOR}]}>
                Based on the results of this assessment, we have calculated areas that you should focus a bit more on and areas that you are already excelling at.
              </Text>
            </View> 
            <Animated.View
              top={slideAnim}
              flex={3}
            >
              <View
                position="absolute"
                backgroundColor="white"
                borderRadius={40}
                width={'100%'}
                height={500}
                top={125}
              />
              <View alignItems="center" flex={1}>
                <Image source={require("../assets/images/heart.png")} style={styles.mainImageContainer}/>
                <Text style={[textStyle.subheader, {color:theme.TEXT_COLOR, opacity: 0.5}]}>
                  YOUR RECOMMENDED FOCUS
                </Text>
                <Text style={[textStyle.header3, {color:theme.PRIMARY_COLOR_6, textAlign: 'center'}]}>
                  {this.state.recArea}
                </Text>
              </View>
              <View style={styles.nextButtonContainer}>
                <Text style={changeBehaviorTextStyle}>
                  Don't want to focus on this?
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      ...changeBehaviorTextStyle,
                      fontFamily: 'poppins-black',
                      marginBottom: 10,
                    }}
                  >
                    Choose another behavior
                  </Text>
                </TouchableOpacity>
                <NextButton 
                onPress={() => this._seeTutorial()} 
                title="NEXT >"/>
              </View>
            </Animated.View>
          </View>
        );
        return <SlideAnimController Component={Component}/>
      case 'tutorial':
        const tips = [
          {
            'text':'Learning',
            'description': 'learning stuff',
          },
          {
            'text':'Implementation',
            'description': 'implementation stuff',
          },
          {
            'text':'Checking in',
            'description': 'checking in stuff',
          },
        ]
        return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}
        >
          <ScrollView
                  contentContainerStyle={styles.contentContainer}
                  horizontal= {true}
                  decelerationRate={0}
                  snapToInterval={width}
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
              {tips.map((tip, index)=> (
                <View style={[styles.scrollScreen]} key={index}>

                  <Image
                    source={require("../assets/images/heart.png")}
                    style={[
                      styles.mainImageContainer,
                      { height: 250, width: 250 },
                    ]}
                  />
                  <Text
                    style={[
                      textStyle.header,
                      {
                        color:theme.TEXT_COLOR,
                        marginBottom: 20,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    {tip['text']}
                  </Text>
                  <Text
                    style={[
                      textStyle.paragraph,
                      {
                        color:theme.TEXT_COLOR,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    {tip['description']}
                  </Text>
                </View> 

              ))}

          </ScrollView>
          <View style={styles.nextButtonContainer}>
            <Animated.View
              top={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [100, 0],
                extrapolate: 'clamp',
              })}
              opacity={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              })}
            >
              <NextButton 
                onPress={() => this._exitAssessment()} 
                title="NEXT >"
              />
            </Animated.View>
            <Animated.View
              alignSelf="center"
              position="absolute"
              flexDirection="row"
              width={width}
              paddingHorizontal={60}
              alignItems="center"
              justifyContent="space-between"
              top={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [13, 90],
                extrapolate: 'clamp',
              })}
              opacity={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              })}
            >
              <View flexDirection="row">
                 {tips.map((_, index) => {
                  
                  const iwidth = scrollX.interpolate({
                    inputRange: [
                      width * (index - 1),
                      width * index,
                      width * (index + 1)
                    ],
                    outputRange: [8, 16, 8],
                    extrapolate: "clamp"
                  });
                  console.log("width "+ width + " index " + index + " scrollX" + scrollX + "iwidth" + iwidth)
                  return (
                    <Animated.View
                      key={index}
                      style={[styles.normalDot, { width: iwidth}]}
                    />
                  );
                })}
              </View>
              <TouchableOpacity onPress={() => this._exitAssessment()}>
                <Text style={[textStyle.label, { color: theme.TEXT_COLOR }]}>
                  SKIP
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        );

    }
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden />
        {
         this.assessmentScreen()
        }
      </View>
    );
  }
}

class SlideAnimController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideAnim: new Animated.Value(500),
    };
  }

  componentDidMount() {
    const { slideAnim } = this.state;
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
    }).start();
  }

  render() {
    const { Component } = this.props;
    const { slideAnim } = this.state;
    return Component(slideAnim);
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  darkContainer: {
    flex: 1,
    backgroundColor:theme.SECONDARY_COLOR,
  },
  correctContainer: {
    flex: 1,
    backgroundColor: theme.CORRECT_COLOR_BG,
  },
  incorrectContainer: {
    flex: 1,
    backgroundColor: theme.INCORRECT_COLOR_BG,
  },
  headerText:{
    color:theme.TEXT_COLOR,
  },
  startEndParagraph:{
    color:theme.TEXT_COLOR, 
    marginTop: 15,
    marginBottom: 20,
    fontSize:15, 
    lineHeight: 20,
  },
  scrollScreen:{
    flex:1,
    alignItems: 'center',
    textAlign:'center',
    justifyContent: 'center',
    width:width,
    paddingHorizontal: 60,
  },
  startScreen: {
    flex:1,
    alignItems: 'center',
    textAlign:'center',
    justifyContent: 'center',
    paddingHorizontal: '15%',

  },
  mainImageContainer:{
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: theme.TEXT_COLOR,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  nextButtonContainer: {
    width: 275,
    alignSelf: 'center',
    top: -45,
  },
});
