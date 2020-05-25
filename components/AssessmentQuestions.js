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
import QuizRadioButton from '../components/QuizRadioButton';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { _getAuthTokenUserId } from '../constants/Helper.js'
import host from '../constants/Server.js';
import {textStyle} from '../styles/text.style.js';




const { width, height } = Dimensions.get('window')
var jsonData = []
export default class AssessmentQuestions extends Component {
  constructor(props){
    super(props);
    this.qno = 0
    this.score = 0

    this.state = {
      question : null,//jsonData[this.qno].text,
      description: null,//jsonData[this.qno].suggestion,
      options : [],//jsonData[this.qno].answers,
      countCheck : 0,
    }

  }
  async componentDidMount(){
    const {authToken, userId} = await _getAuthTokenUserId();


    //Get whether user finished initial assessment
    console.log('http://'+host+':3000/initial/' + userId + '/' + authToken);

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
      this.setState({question:jsonData[this.qno].text,
                     description:jsonData[this.qno].suggestion,
                     options:jsonData[this.qno].answers});
    })
    .catch((error) => {
      console.error(error);
    });


  }
  prev(){
    if(this.qno > 0){
      this.qno--
      this.setState({ question: jsonData[this.qno].text,
                      description: jsonData[this.qno].suggestion,
                      options: jsonData[this.qno].answers})
    }
  }
  next(){
    this.props.updateProgress((this.qno+1)/jsonData.length);

    if(this.qno < jsonData.length-1){
      this.qno++

      this.setState({ countCheck: 0, 
                      question: jsonData[this.qno].text,
                      description: jsonData[this.qno].suggestion,
                      options: jsonData[this.qno].answers})
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

  }

  render() {
    let _this = this
    const currentOptions = this.state.options

    const options = this.state.options

    return (
      <>
      <View style={{backgroundColor:'grey', width: 100, height:100, position:'absolute',top:80, left: 50, zIndex:2}}>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
          <View>
            <Text style={[styles.question, textStyle.subheader]}>
              {this.state.question}
            </Text>
          </View>
          <View style={{ marginTop: 20}}>
            <QuizRadioButton  options={options}
                          color = {theme.PRIMARY_COLOR}
                          updateValue={this.updateValue.bind(this)} 
            />
          </View>
      </ScrollView>
      <NextButton title="NEXT >" onPress={() => this.next()} buttonStyle={styles.buttonStyle}/>
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