import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Button } from 'react-native-elements';


export default class NextButton extends Component {
	render() {
		return (
			<Button buttonStyle={styles.nextButton} 
              onPress={() => this.props.onPress()} 
              title={this.props.title}
              titleStyle={styles.nextButtonTitle}
              raised={true} 
              icon={{name: 'arrow-forward', color:'white'}} 
              iconRight={true}/>
		);
	}
}

const styles = StyleSheet.create({
  nextButton:{
    backgroundColor: theme.PRIMARY_COLOR_6,
    borderRadius: 20,
    alignSelf:'stretch',
    paddingLeft:30,
    paddingRight: 30,
    marginBottom:0,

  },
  nextButtonTitle:{
    fontSize: 17,
  },
});