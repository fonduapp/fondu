import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';

export default class RadioButtons extends Component {
	state = {
		value: null,
	};

	constructor(props) {
		super(props);
		this.updateValue = this.updateValue.bind(this);
	}

	updateValue(key) {
		this.props.updateValue(key);
		this.setState({value: key,});
	}
	render() {
		const { options } = this.props;
		const { value } = this.state;


		return (
			<View>
				{Object.keys(options).map((key, index) => {
					return (
						<View style={{flexDirection:"row", marginBottom: 20}}>
							<View style = {{marginRight: 30}}>
								{ this.props.icon[index]!=null ?
								<Icon name={this.props.icon[index]} size={40} color={this.props.color}/> :
								<View style={{width:40, height:40}}></View>
								}
							</View>
							<View key={key} style={styles.buttonContainer}>
								<TouchableOpacity
									style={value === key ? styles.optionsButtonSelected : styles.optionsButton }
									onPress={() => {
											this.updateValue(key)
										}
									}
								>
								<Text style={value === key ? styles.optionButtonTextSelected : styles.optionButtonText}>{options[key]}</Text>
								</TouchableOpacity>
							</View>
						</View>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	optionsButton:{
	    backgroundColor:theme.PRIMARY_COLOR,
	    borderRadius: 20,
	    alignItems: 'center',
	    width:250,
	    padding: 10,
	   	borderColor: theme.PRIMARY_COLOR,
	    borderWidth: 2,
	},
	optionsButtonSelected:{
	    backgroundColor:'transparent',
	    borderColor: theme.PRIMARY_COLOR,
	    borderWidth: 2,
	    borderRadius: 20,
	    alignItems: 'center',
	    width:250,
	    padding: 10,

	},
	optionButtonText:{
		color: 'white',
	},
	optionButtonTextSelected:{
	    color: theme.PRIMARY_COLOR,
	},
	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
		justifyContent: 'center',
	},
  
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#794F9B',
	},
});
