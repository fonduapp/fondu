import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';



export default class ProgressBar extends Component {

	findPercentage(){
		let percentage = this.props.progress;

		return (percentage*100).toString() + '%';
	}

	render() {
		return (
	      <View style = {styles.outerProgressBar}>
	      	<View style = {[styles.innerProgressBar,{backgroundColor:this.props.color, width:this.findPercentage(),}]}></View>
	      </View>
		);
	}
}

const styles = StyleSheet.create({
	outerProgressBar:{
		backgroundColor:'lightgray',
		height:15,
		flex:1,
		borderRadius: 15,
		flexDirection: 'row',
	},
	innerProgressBar:{
		height:15,
		borderRadius: 15,
	}

});