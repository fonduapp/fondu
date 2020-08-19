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
import { _getAuthTokenUserId } from '../utils/Helper.js'
import host from '../constants/Server.js';
import {textStyle} from '../styles/text.style.js';
import Loader from '../components/Loader';
import fetch from '../utils/Fetch';


const { width, height } = Dimensions.get('window')
let jsonData = []

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
      extraOptionSelected: false,
      authToken:null,
      userId:null,
      extraOption: null,
      loading: true,
    }

  }

  updateQuestion(shouldShuffle) {
    const {
      text: question,
      suggestion: description,
      answers: options,
      behavior_id: behaviorId,
      question_id: questionId,
      extra_option: extraOption,
    } = jsonData[this.qno];
    if (shouldShuffle) {
      this.shuffleArray(options);
    }
    this.setState({
      question,
      description,
      options,
      behaviorId,
      questionId,
      extraOption,
    });
  }

  async componentDidMount(){
    jsonData = [];
    const {authToken, userId} = await _getAuthTokenUserId();

    this.setState({authToken: authToken, userId: userId});
    const {
      assessmentType,
      behaviorId,
      behaviors,
    } = this.props;

    //get questions

    console.log("assessmenttype " + assessmentType);
    switch(assessmentType) {
      case 'learning':
        await this.fetchAndAddQuestions('learningQuestions', behaviorId);
        break;
      case 'review':
        await Promise.all(
          behaviors.map((behavior) => this.fetchAndAddQuestions('usageQuestions', behavior))
        );
        this.shuffleArray(jsonData);
        break;
      case 'initial':
        await this.fetchAndAddQuestions('initial');
        break;
      default:
        console.error("unknown assessment type");
    }
    this.updateQuestion(true);
    this.setState({
      loading: false,
    });
  }

  fetchAndAddQuestions(request, behaviorId) {
    return fetch('GET', request, !!behaviorId ? { behaviorId } : {})
      .then((responseJson) => {
        //convert json string to json object
        jsonData = jsonData.concat(
          responseJson.map(row => (row.answers = JSON.parse(row.answers), row))
        );

      })
      .catch(console.error);
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
      this.updateQuestion(false);
    }
  }

  check(){

    this.setState({qFeedback: true});
    this.props.questionFinish(this.state.options[this.state.selectedOption].exp===10, true);
    let request;
    let idParam;
    switch(this.props.assessmentType) {
      case 'review':
      case 'initial':
        request = 'addExp';
        idParam = { questionId: this.state.questionId };
        break;
      case 'learning':
        request = 'addExpLearning';
        idParam = { behaviorId: this.state.behaviorId };
        break;
      default:
        console.error('unknown assessment type');
    }

    const params = {
      ...idParam,
      exp: this.state.options[this.state.selectedOption].exp,
    };

    //send answer to the db
    fetch('POST', request, params)
      .catch(console.error);

  }
  next(){
    this.setState({qFeedback: false});
    this.props.questionFinish(true, false);
    this.props.updateProgress((this.qno+1)/jsonData.length);
    this.setState({
      selectedOption: -1,
      extraOptionSelected: false,
    });

    if(this.qno < jsonData.length-1){
      this.qno++
      this.updateQuestion(true);
      this.setState({
        countCheck: 0,
      });


      
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
    this.setState({
      selectedOption: ans,
      extraOptionSelected: false,
    });
  }

  selectExtraOption = () => {
    this.setState({
      selectedOption: -1,
      extraOptionSelected: true,
    });
  }

  findCorrectAnswer(options){
    for (let i = 0; i < options.length; i++) {
      if(options[i].exp===10)
        return options[i];
    }

  }

  render() {
    const {
      loading,
      extraOption,
      extraOptionSelected,
    } = this.state;

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
                          extraOption={extraOption}
                          selectExtraOption={this.selectExtraOption}
            />
            }
          </View>
      </ScrollView>
      
      <View style={nextButtonContainerStyle}>
        <NextButton title="NEXT >" 
                    disabled = {this.state.selectedOption < 0 && !extraOptionSelected} 
                    onPress={() => this.state.qFeedback || extraOptionSelected ? this.next() : this.check()} 
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
