import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AssessmentQuestions  from '../components/AssessmentQuestions';
import theme from '../styles/theme.style.js';
import { Button, Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import ProgressNavBar from '../components/NavBar';

export default class AssessmentScreen extends Component{

  constructor(props){
    super(props)
    this.state = {
      screen:'start', // start, quiz, finish
      quizFinish : false,
      score: 0,
      progress:0,
    }
    this.assessmentScreen.bind(this)

  }
  _startQuiz(){
    this.setState({ screen:'quiz' })
  }
  _quizFinish(score){    
    this.setState({ screen:'finish', score : score })
  }

  _updateProgress(progress){

    this.setState({ progress: progress})
  }

  _seeStreaks(){
    this.setState({ screen: 'streak'})
  }

  _seeResults(){
    this.setState({ screen:'result' })
  }

  _exitAssessment(){
    this.props.navigation.navigate('Home')
  }

  assessmentScreen(){
    const { navigation } = this.props;

    switch(this.state.screen){
      case 'start':
        
        return (
        <View style={styles.darkContainer}>

          <ProgressNavBar navigation={navigation}/>
          <View style={styles.startScreen}>

              <View style={styles.mainImageContainer}>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon name="access-time" color="white" size={17}/>
                <Text style={{color:'white', marginBottom:5, marginLeft:5, fontSize:13 }}>
                  ~15 minutes
                </Text>
              </View>
              <View style={{marginLeft:70, marginRight:70, marginTop: 10}}>
                <NextButton 
                onPress={() => this._startQuiz()} 
                title="Get Started"></NextButton>
                <Text style={{color:'white', fontWeight:'bold', fontSize:15, marginTop: 30}}>
                  Why should I take this assessment?
                </Text>
                <Text style={{color:'white', marginTop: 15, fontSize:15, lineHeight: 20,}}>
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
            <View style={{marginLeft:70, marginRight:70, marginTop: 40, marginBottom: 40}}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:25,}}>
                Congrats, you did it!
              </Text>
              <Text style={styles.startEndParagraph}>
              By taking this assessment routinely, we’re able to better assess 
              your relationship health and behaviors and inform you of healthy 
              next steps!
              </Text>
              <NextButton 
              onPress={() => this._seeStreaks()} 
              title="Next"></NextButton>
            </View>

        </View> 
        );

      case 'quiz':
        return (
          <View style = {{flex:1}}>
            <ProgressNavBar color={theme.PRIMARY_COLOR} navigation={navigation} progress={this.state.progress}/>
            <AssessmentQuestions quizFinish={(score) => this._quizFinish(score)} 
                                 updateProgress={(progress) => this._updateProgress(progress)}/>
          </View>
        );
      case 'streak':
        setTimeout(this._seeResults.bind(this), 1000);
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <View style={{marginLeft:70, marginRight:70, marginTop: 40, marginBottom: 40}}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:25,}}>
                Streak +1
              </Text>
            </View>
            <View style={styles.mainImageContainer}>
            </View>

        </View> 
        );
      case 'result':
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <View style={{flex:1, 
                    marginLeft:50, 
                    marginRight:50, 
                    marginTop: 100, 
                    marginBottom: 100, 
                    backgroundColor: 'white', 
                    borderRadius:40,
                    padding: 35,
                  }}>
              <Text style={{color:theme.PRIMARY_COLOR, fontWeight:'bold', fontSize:25,}}>
                Here are your results compared to previous weeks.
              </Text>
              <View style={{flex:1, flexDirection:'column', justifyContent:'center', marginTop:40, marginBottom: 40}}>
                <View style={{flex:1, flexDirection:'row'}}>
                  <Icon name='arrow-upward' color = {theme.PRIMARY_COLOR} size ={40}/>
                  <Text style={{color:theme.PRIMARY_COLOR, fontWeight:'bold', fontSize:25, marginRight: 20}}>10%</Text>
                  <Text style={{color:theme.PRIMARY_COLOR, fontWeight:'bold', fontSize:25,}}>Topic 1</Text>
                </View>
                <View style={{flex:1, flexDirection:'row'}}>
                  <Icon name='arrow-downward' color = {theme.PRIMARY_COLOR_6} size ={40}/>
                  <Text style={{color:theme.PRIMARY_COLOR_6, fontWeight:'bold', fontSize:25, marginRight: 20}}>10%</Text>
                  <Text style={{color:theme.PRIMARY_COLOR_6, fontWeight:'bold', fontSize:25,}}>Topic 1</Text>
                </View>
                <View style={{flex:1, flexDirection:'row'}}>
                  <Icon name='arrow-downward' color = {theme.PRIMARY_COLOR_6} size ={40}/>
                  <Text style={{color:theme.PRIMARY_COLOR_6, fontWeight:'bold', fontSize:25, marginRight: 20}}>10%</Text>
                  <Text style={{color:theme.PRIMARY_COLOR_6, fontWeight:'bold', fontSize:25,}}>Topic 1</Text>
                </View>

              </View>

              <NextButton 
              onPress={() => this._exitAssessment()} 
              title="I'm ready to improve!"></NextButton>
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




const styles = StyleSheet.create({

  container: {
    flex: 1,


  },
  darkContainer: {
    flex: 1,
    backgroundColor:theme.PRIMARY_COLOR_7,
  },
  startEndParagraph:{
    color:'white', 
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

  },
  mainImageContainer:{
    width: 150,
    height:150,
    backgroundColor: '#F2F2F2',
    marginBottom: 30,
  },
});
