import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';
import {textStyle} from '../styles/text.style.js';



export default class ProgressBar extends Component {

	findPercentage(){
		let percentage = this.props.progress;

		return (percentage*100).toString() + '%';
	}

	render() {
		return (
		  <View style={{flexDirection:'row', flex: 1, alignItems:'center'}}>
	      <View style = {[styles.outerProgressBar, this.props.style]}>
	      	<View style = {[styles.innerProgressBar,{backgroundColor:this.props.color==null?theme.PRIMARY_COLOR:this.props.color, width:this.findPercentage(),}]}/>

	      </View>
	      <Text style={[textStyle.label, {color: this.props.color==null?theme.PRIMARY_COLOR:this.props.color, opacity: 0.5, marginLeft:10}]}>{this.props.label}</Text>
	      </View>
		);
	}
}

const styles = StyleSheet.create({
	outerProgressBar:{
		backgroundColor:'lightgray',
		height:15,
		borderRadius: 15,
		flexDirection: 'row',
		width: '80%'
	},
	innerProgressBar:{
		height:15,
		borderRadius: 15,
	}

});