import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Button } from 'react-native-elements';


export default class NextButton extends Component {
	render() {
		return (
      <TouchableOpacity 
        onPress={() => this.props.onPress()}
        style={[styles.nextButton, this.props.buttonStyle]} 
      >
      <Text>{this.props.title}</Text>
      </TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
  nextButton:{
    backgroundColor: theme.PRIMARY_COLOR_6,
    borderRadius: 20,
    paddingLeft:30,
    paddingRight: 30,
    marginBottom:0,
    bottom: 0,
    height: 30,
    zIndex: 10,


  },
  nextButtonTitle:{
    fontSize: 17,
  },
});