import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';


export default class QuizRadioButton extends Component {
	state = {
		value: null,
		icon: null,
	};

	constructor(props) {
		super(props);
		this.updateValue = this.updateValue.bind(this);
		this.state={icon:this.props.icon};
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
				{options.map((item, key) => {
					return (
						<View style={{flexDirection:"row", marginBottom: 10}} key={key}>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={value === key ? styles.optionsButtonSelected : styles.optionsButton }
									onPress={() => {
											this.updateValue(key)
										}
									}
								>
								<Text style={[value === key ? styles.optionButtonTextSelected : styles.optionButtonText, textStyle.paragraph]}>{options[key].answer}</Text>
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
	    borderRadius: 16,
	    width: '100%',
	    padding: 15,
	   	borderColor: theme.SECONDARY_COLOR,
	    borderWidth: 1.5,
	},
	optionsButtonSelected:{
	    backgroundColor:theme.PRIMARY_COLOR,
	    width: '100%',
	    borderColor:'transparent',
	    borderWidth: 2,
	    borderRadius: 16,
	    padding: 15,

	},
	optionButtonText:{
		color: theme.TEXT_COLOR,
		opacity: 0.7
		
	},
	optionButtonTextSelected:{
	    color: "white",
	},
});
