import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AssessmentQuestions  from '../components/AssessmentQuestions';

export default class AssessmentScreen extends Component{

  constructor(props){
    super(props)
    this.state = {
      quizFinish : false,
      score: 0
    }
  }

  _quizFinish(score){    
    this.setState({ quizFinish: true, score : score })
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <AssessmentQuestions quizFinish={(score) => this._quizFinish(score)} /> 
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
