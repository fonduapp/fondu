import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Button } from 'react-native-elements';
import { textStyle } from '../styles/text.style.js';
import { shadowStyle } from '../styles/shadow.style.js';


export default class NextButton extends Component {
	render() {
		return (
      <TouchableOpacity 
        disabled = {this.props.disabled}
        onPress={() => this.props.onPress()}
        style={{
          ...styles.nextButton,
          ...this.props.buttonStyle,
          ...(this.props.disabled && { backgroundColor: theme.INACTIVE_COLOR }),
        }} 
      >
      <Text style={[styles.nextButtonTitle, this.props.buttonTextStyle]}>{this.props.title}</Text>
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
    height: 50,
    width: '100%',
    zIndex: 10,
    display: 'flex',
    justifyContent:'center',
    ...shadowStyle.primaryShadowStyle,
  },
  nextButtonTitle:{
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'poppins-bold'
  },
});
