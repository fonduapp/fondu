import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AssessmentQuestions  from '../components/AssessmentQuestions';
import theme from '../styles/theme.style.js';
import { Button, Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import ProgressNavBar from '../components/NavBar';
import {textStyle} from '../styles/text.style.js';
import { _getAuthTokenUserId } from '../constants/Helper.js'
import host from '../constants/Server.js';


export default class AssessmentScreen extends Component{

  constructor(props){
    super(props)
    const { navigation } = props;
    this.state = {
      screen:'start', // start, quiz, finish
      quizFinish : false,
      score: 0,
      progress:0,
      assessmentType: JSON.stringify(navigation.getParam('assessmentType','none')),// initial, routine, relationship, none
      questionDone:false,
      questionRight: false,
      recArea:'nothing',
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

    //find recommended behavior
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
        recArea: responseJson.area_id,
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

  assessmentScreen(){
    const { navigation } = this.props;

    switch(this.state.screen){
      case 'start':
        
        return (
        <View style={styles.darkContainer}>

          <ProgressNavBar navigation={navigation} color={theme.TEXT_COLOR}/>
          <View style={styles.startScreen}>
              <View style={styles.mainImageContainer}>
              </View>
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
        <View style={[styles.startScreen, styles.darkContainer]}>
            <View style={styles.mainImageContainer}>
            </View>
            <Text style={[textStyle.header, {color:theme.TEXT_COLOR}]}>
              Congrats, you did it!
            </Text>
            <Text style={[textStyle.paragraph,{marginTop:30, marginBottom: 15, opacity: 0.5}]}>
            By taking this assessment routinely, we’re able to better assess 
            your relationship health and behaviors and inform you of healthy 
            next steps!
            </Text>
            <NextButton 
            onPress={() => this._seeStreaks()} 
            title="Next"/>

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
                                 />
          </View>
        );
      case 'streak':
        setTimeout(this._seeResults.bind(this), 1000);
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <Image source = {require('../assets/images/streak-fire.png')} style={{width: 120, height: 120}}/>
            <Text style={[{marginLeft:70, marginRight:70, marginTop: 40}, textStyle.header,{color:theme.TEXT_COLOR}]}>
                Streak +1
            </Text>
        </View> 
        );
      case 'result':
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <Text style={[textStyle.header, {color:theme.TEXT_COLOR, alignSelf:'flex-start'}]}>
              Your Results
            </Text>
            <Text style={[textStyle.paragraph, {color:theme.TEXT_COLOR}]}>
              Based on the results of this assessment, we have calculated areas that you should focus on a bit more on and areas that you are already excelling at.
            </Text>
            <View style={styles.mainImageContainer}>
            </View>
            <Text style={[textStyle.caption, {color:theme.TEXT_COLOR}]}>
              YOUR RECOMMENDED FOCUS
            </Text>
            <Text style={[textStyle.header, {color:theme.PRIMARY_COLOR_6}]}>
              {this.state.recArea}
            </Text>
            <NextButton 
            onPress={() => this._exitAssessment()} 
            title="Next"/>

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
  startScreen: {
    flex:1,
    alignSelf:'stretch',
    alignItems: 'center',
    textAlign:'center',
    justifyContent: 'center',
    padding: '15%',

  },
  mainImageContainer:{
    width: 150,
    height:150,
    backgroundColor: '#F2F2F2',
    marginBottom: 30,
  },
});
