import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../styles/theme.style.js';
import {QuizRadioButton, QuizButton} from '../components/QuizRadioButton';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { _getAuthTokenUserId } from '../constants/Helper.js'
import host from '../constants/Server.js';
import {textStyle} from '../styles/text.style.js';
import Loader from '../components/Loader';



const { width, height } = Dimensions.get('window')
var jsonData = []
var originalFetch = require('isomorphic-fetch');
var fetch = require('fetch-retry')(originalFetch);

export default class AssessmentQuestions extends Component {
  constructor(props){
    super(props);
    this.qno = 0
    this.score = 0

    this.state = {
      question : null,
      description: null,
      options : [],
      questionId: 0,
      countCheck : 0,
      qFeedback: false,
      selectedOption:-1,
      authToken:null,
      userId:null,
      loading: true,
    }

  }
  async componentDidMount(){
    const {authToken, userId} = await _getAuthTokenUserId();




    this.setState({authToken: authToken, userId: userId});

    //get questions
    console.log("assessmenttype " + this.props.assessmentType);
    switch(this.props.assessmentType){
      case "routine":

        console.log("behaviorId" + this.props.behaviorId)
        //get routine questions
        fetch('http://'+host+':3000/learningQuestions/' + userId + '/' + authToken + '/' + this.props.behaviorId,{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
          jsonData = responseJson
          //convert json string to json object
          jsonData = jsonData.map(row => (row.answers = JSON.parse(row.answers), row));
          this.shuffleArray(jsonData[this.qno].answers)
          this.setState({question:jsonData[this.qno].text,
                         description:jsonData[this.qno].suggestion,
                         options:jsonData[this.qno].answers,
                         behaviorId:jsonData[this.qno].behavior_id,
                         questionId:jsonData[this.qno].question_id,
                         loading: false,
          });
          console.log("in initial");
        })
        .catch((error) => {
          console.error(error);
        });
      break;

      case "initial":

        //Get whether user finished initial assessment
        console.log('http://'+host+':3000/initial/' + userId + '/' + authToken);
        //get initial questions
        fetch('http://'+host+':3000/initial/' + userId + '/' + authToken,{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
          jsonData = responseJson
          //convert json string to json object
          jsonData = jsonData.map(row => (row.answers = JSON.parse(row.answers), row));
          this.shuffleArray(jsonData[this.qno].answers)
          this.setState({question:jsonData[this.qno].text,
                         description:jsonData[this.qno].suggestion,
                         options:jsonData[this.qno].answers,
                         behaviorId:jsonData[this.qno].behavior_id,
                         questionId:jsonData[this.qno].question_id,
                         loading: false,
          });
          console.log("in initial");
        })
        .catch((error) => {
          console.error(error);
        });
      break;

    default:
      console.log("???")

    }

  }
  shuffleArray(arr){
    var ctr = arr.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arr[ctr];
        arr[ctr] = arr[index];
        arr[index] = temp;
    }
  }

  prev(){
    if(this.qno > 0){
      this.qno--
      this.setState({ question: jsonData[this.qno].text,
                      description: jsonData[this.qno].suggestion,
                      options: jsonData[this.qno].answers,
                      behaviorId:jsonData[this.qno].behavior_id,
                      questionId:jsonData[this.qno].question_id})
    }
  }

  async check(){

    this.setState({qFeedback: true});
    this.props.questionFinish(this.state.options[this.state.selectedOption].exp===10, true);

    console.log('http://' + host +':3000/addExp/' + this.state.userId + '/' + this.state.authToken + '/' + this.state.questionId + '/' + this.state.options[this.state.selectedOption].exp)

    //send answer to the db
    fetch('http://' + host +':3000/addExp',{
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userId': this.state.userId,
        'authToken': this.state.authToken,
        'questionId': this.state.questionId,
        'exp': this.state.options[this.state.selectedOption].exp,
      })
    })
    .catch((error) => {
      console.error(error);
    });

  }
  next(){
    this.setState({qFeedback: false});
    this.props.questionFinish(true, false);
    this.props.updateProgress((this.qno+1)/jsonData.length);
    this.setState({selectedOption:-1})

    if(this.qno < jsonData.length-1){
      this.qno++
      this.shuffleArray(jsonData[this.qno].answers)

      this.setState({ countCheck: 0,
                      question: jsonData[this.qno].text,
                      description: jsonData[this.qno].suggestion,
                      options: jsonData[this.qno].answers,
                      behaviorId:jsonData[this.qno].behavior_id,
                      questionId:jsonData[this.qno].question_id,
                    })


      
    }else{
      
      this.props.quizFinish(this.score*100/5)
     }
  }
  _answer(status,ans){

    if(status == true){
        const count = this.state.countCheck + 1
        this.setState({ countCheck: count })
        if(ans == this.state.correctoption ){
          this.score += 1
        }
      }else{
        const count = this.state.countCheck - 1
        this.setState({ countCheck: count })
       //  if(this.state.countCheck < 1 || ans == this.state.correctoption){
       //  this.score -= 1
       // }
      }

      let pressStatus = this.state.pressStatus;
      this.setState({pressStatus: !pressStatus})

  }

  updateValue(ans){
    this.setState({selectedOption: ans});

  }

  findCorrectAnswer(options){
    for (let i = 0; i < options.length; i++) {
      if(options[i].exp===10)
        return options[i];
    }

  }

  render() {
    const { loading } = this.state;

    let _this = this

    const options = this.state.options

    const correctAnswer = (this.findCorrectAnswer(options));

    let userId = this.state.userId
    let authToken = this.state.authToken

    const { nextButtonContainerStyle } = this.props;

    let imgsrc = 'http://'+host+':3000/behaviorImage/' + userId + '/' + authToken+'/' + this.state.behaviorId
    return (
      <>
      {loading && <Loader/>}
      <Image source={{uri:imgsrc}} style = {{height: 120, width:120, margin: 5, position:'absolute',top:50, left: 30, zIndex:2}}/>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
          <View>
            <Text style={[styles.question, textStyle.subheader]}>
              {this.state.question}
            </Text>
          </View>
          <View style={{ marginTop: 20}}>
            {this.state.qFeedback?
            <View>
              <QuizButton  option={options[this.state.selectedOption]}
                            color = {theme.PRIMARY_COLOR}
                            updateValue={this.updateValue.bind(this)} 
              />
              <Text style ={[textStyle.subheader,{color:options[this.state.selectedOption].exp===10?theme.CORRECT_COLOR:theme.INCORRECT_COLOR, paddingLeft: 15, fontSize: 15}]}>
                {options[this.state.selectedOption].exp===10?"Nice!":"Correct answer:"}
              </Text>
              {options[this.state.selectedOption].exp<10?
              <Text style ={[textStyle.paragraph,{color:theme.INCORRECT_COLOR, paddingLeft: 15, marginBottom: 10, opacity: 0.8,}]}>
              {correctAnswer.answer}
              </Text>
              :null
              }
              
              <Text style ={[textStyle.paragraph,{color:theme.TEXT_COLOR, paddingLeft: 15, opacity: 0.6}]}>
                {options[this.state.selectedOption].research}
              </Text>

              <Text style ={[textStyle.footer,{color:theme.TEXT_COLOR, paddingLeft: 15, opacity: 0.2, marginTop: 15}]}>
                {options[this.state.selectedOption].reference}
              </Text>
            </View>
              :
            <QuizRadioButton  options={options}
                          color = {theme.PRIMARY_COLOR}
                          updateValue={this.updateValue.bind(this)} 
            />
            }
          </View>
      </ScrollView>
      
      <View style={nextButtonContainerStyle}>
        <NextButton title="NEXT >" 
                    disabled = {this.state.selectedOption <0} 
                    onPress={() => this.state.qFeedback ? this.next() : this.check()} 
                    buttonStyle={[styles.buttonStyle,{backgroundColor: theme.PRIMARY_COLOR_6}]}/>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({

  question: {
    fontSize: 24,
    color: theme.TEXT_COLOR,
  },
  description:{
    marginTop: 5,
    color: 'gray',
    fontSize: 15,
    fontStyle: 'italic',
  },
  buttonStyle:{
    position:'relative', 
    top:-45, 
    alignSelf: 'center', 
    width: '60%'

  },
  optionButtonTextSelected:{
    color: theme.PRIMARY_COLOR,
  },
  scrollContainer:{
    backgroundColor: "white", 
    margin: 20,
    marginTop: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  }
  ,
  container: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
    flexDirection: 'column', 
  },
});
