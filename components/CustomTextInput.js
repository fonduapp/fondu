import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import theme from '../styles/theme.style.js';


export default class CustomTextInput extends Component {
	render() {
		return (
      <View style= {styles.container}>
      <Text style={styles.subheader}>{this.props.title}</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={this.props.onChangeText}
        value={this.props.value}/>

      </View>
		);
	}
}

const styles = StyleSheet.create({
  container:{
    width: '60%',
    marginBottom: 30
  },
  subheader:{
    textAlign: 'left',
  },
  textInput:{
    height: 30, borderColor: 'gray', borderBottomWidth: 1

  },
  nextButtonTitle:{
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
});