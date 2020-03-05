import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions,} from 'react-native';
import theme from '../styles/theme.style.js';

const { width } = Dimensions.get('window');


export default class WeekBar extends Component {

	render() {
		const daysOfWeek = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
		const daysList = daysOfWeek.map((day, index) => 
					<Text style = {styles.textStyle} key = {index}>{day}</Text>
				);
		
		return (
	        <View style = {styles.container}>
	        	{daysList}
            </View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		display: 'flex',
		flexDirection: 'row',
		justifyContent: "space-around",
		backgroundColor: theme.PRIMARY_COLOR,
		padding: 15,
		margin: 15,
		borderRadius: 30,

	},

	textStyle:{
		color:'white',
		marginLeft: 5,
		marginRight: 5,
		fontWeight: 'bold'

	}
});