import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import theme from '../styles/theme.style.js';
import RadioButton from '../components/RadioButton';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { CSSTransition, TransitionGroup } from "react-transition-group";




const { width, height } = Dimensions.get('window')
let arrnew = []
const jsonData = {"quiz" : {
  "quiz1" : {
    "question1" : {
      "correctoption" : "option3",
      "options" : {
        "option1" : "Extremely Satisfied",
        "option2" : "Somewhat Satisfied",
        "option3" : "Neutral",
        "option4" : "Somewhat Unsatisfied",
        "option5" : "Extremely Unsatisfied",
      },
      "question" : "How satisfied are you with this relationship?",
      "description": "Think about how your partner has made you feel during your interactions.",
      "icon": true,
    },
    "question2" : {
      "correctoption" : "option4",
      "options" : {
          "option1" : "XML",
          "option2" : "YML",
          "option3" : "HTML",
          "option4" : "JSX"
        },
      "question" : "____ tag syntax is used in React",
      "icon": false,
    },
    "question3" : {
      "correctoption" : "option1",
      "options" : {
          "option1" : "Single root DOM node",
          "option2" : "Double root DOM node",
          "option3" : "Multiple root DOM node",
          "option4" : "None of the above"
        },
      "question" : "Application built with just React usually have ____"
    },
    "question4" : {
      "correctoption" : "option2",
      "options" : {
          "option1" : "mutable",
          "option2" : "immutable",
          "option3" : "variable",
          "option4" : "none of the above"
        },
      "question" : "React elements are ____"
    },
    "question5" : {
      "correctoption" : "option3",
      "options" : {
          "option1" : "functions",
          "option2" : "array",
          "option3" : "components",
          "option4" : "json data"
        },
      "question" : "React allows to split UI into independent and reusable pieses of ____"
    }
  }
}
}
export default class AssessmentQuestions extends Component {
  constructor(props){
    super(props);
    this.qno = 0
    this.score = 0

    const jdata = jsonData.quiz.quiz1
    arrnew = Object.keys(jdata).map( function(k) { return jdata[k] });
    this.state = {
      question : arrnew[this.qno].question,
      description: arrnew[this.qno].description,
      options : arrnew[this.qno].options,
      correctoption : arrnew[this.qno].correctoption,
      countCheck : 0,
      icon: arrnew[this.qno].icon,

    }

  }
  prev(){
    if(this.qno > 0){
      this.qno--
      this.setState({ question: arrnew[this.qno].question, 
                      options: arrnew[this.qno].options, 
                      correctoption : arrnew[this.qno].correctoption, 
                      icon : arrnew[this.qno].icon})
    }
  }
  next(){
    this.props.updateProgress((this.qno+1)/arrnew.length);

    if(this.qno < arrnew.length-1){
      this.qno++

      this.setState({ countCheck: 0, 
                      question: arrnew[this.qno].question, 
                      options: arrnew[this.qno].options, 
                      correctoption : arrnew[this.qno].correctoption, 
                      icon : arrnew[this.qno].icon})
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
        if(this.state.countCheck < 1 || ans == this.state.correctoption){
        this.score -= 1
       }
      }

      let pressStatus = this.state.pressStatus;
      this.setState({pressStatus: !pressStatus})

  }

  updateValue(ans){

  }

  render() {
    let _this = this
    const currentOptions = this.state.options

    const options = this.state.options

    return (
      <ScrollView style={{flex:1,}}>
        <View style={styles.container}>

          <View style={{ flex: 1,flexDirection: 'column', justifyContent: "space-between", alignItems: 'center'}}>

            <View style={styles.questionBox}>
              <Text style={styles.question}>
                {this.state.question}
              </Text>
              <Text style={styles.description}>
                {this.state.description}
              </Text>
            </View>
            <View style={{ flex: 1, marginTop: 20}}>
              <View style={{}}>
                <RadioButton  options={options}
                              color = {theme.PRIMARY_COLOR}
                              updateValue={this.updateValue.bind(this)} 
                              icon={this.state.icon ? ["sentiment-very-satisfied",null, "sentiment-neutral", null, "sentiment-very-dissatisfied"]
                                                    : null}/>
              </View>
                <View style={{marginTop:30}}>
                <NextButton title="Next" onPress={() => this.next()}>
                </NextButton>
                </View>
              </View>



          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  question: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.TERTIARY_COLOR,
  },
  description:{
    marginTop: 5,
    color: 'gray',
    fontSize: 15,
    fontStyle: 'italic',
  },
  optionsButton:{
    backgroundColor:theme.PRIMARY_COLOR,
    borderRadius: 20,
    paddingLeft:30,
    paddingRight:30,
  },
  optionsButtonSelected:{
    backgroundColor:'transparent',
    borderColor: theme.PRIMARY_COLOR,
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft:30,
    paddingRight:30,
  },
  optionButtonTextSelected:{
    color: theme.PRIMARY_COLOR,
  },
  questionBox:{
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});