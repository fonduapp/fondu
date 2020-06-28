import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import Color from 'color';

class QuizRadioButton extends Component {
	state = {
		value: null,
		icon: null,
    extraOptionSelected: false,
	};

	constructor(props) {
		super(props);
		this.updateValue = this.updateValue.bind(this);
		this.state={icon:this.props.icon};
	}

	updateValue(key) {
		this.props.updateValue(key);
		this.setState({
      value: key,
      extraOptionSelected: false,
    });
	}

  selectExtraOption = () => {
    const { selectExtraOption } = this.props;
    selectExtraOption();
    this.setState({
      value: null,
      extraOptionSelected: true,
    });
  }

	render() {
		const {
      options,
      extraOption,
    } = this.props;
		const {
      value,
      extraOptionSelected,
    } = this.state;
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
        {!!extraOption && (
          <View style={{flexDirection:"row", marginBottom: 10}} key={'extraOption'}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={extraOptionSelected ? [
                  styles.optionsButtonSelected,
                  styles.extraOptionButtonSelected,
                ] : [
                  styles.optionsButton,
                  styles.extraOptionButton,
                ]}
                onPress={() => {
                    this.selectExtraOption();
                  }
                }
              >
              <Text style={[extraOptionSelected ? styles.optionButtonTextSelected : styles.optionButtonText, textStyle.paragraph]}>{extraOption}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
			</View>
		);
	}
}

class QuizButton extends Component {
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
		const { option} = this.props;
		const { value } = this.state;
		return (
			<View>
				<View style={{flexDirection:"row", marginBottom: 10}}>
					<View style={[ styles.optionsButtonSelected, {backgroundColor: option.exp === 10 ? theme.CORRECT_COLOR : theme.INCORRECT_COLOR}]}>
						<Text style={[styles.optionButtonTextSelected, textStyle.paragraph]}>{option.answer}</Text>
					</View>
				</View>

			</View>
		);
	}
}

export {QuizRadioButton, QuizButton}

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
	   	borderColor: Color(theme.TEXT_COLOR).alpha(0.2).string(),
	    borderWidth: 1,
	},
  extraOptionButton: {
    backgroundColor: Color('darkgray').alpha(0.2).string(),
  },
	optionsButtonSelected:{
	    backgroundColor:theme.PRIMARY_COLOR,
	    width: '100%',
	    borderColor:'transparent',
	    borderWidth: 1,
	    borderRadius: 16,
	    padding: 15,

	},
  extraOptionButtonSelected: {
    backgroundColor: 'darkgray',
  },
	optionButtonText:{
		color: theme.TEXT_COLOR,
		opacity: 0.7
		
	},
	optionButtonTextSelected:{
	    color: "white",
	},
});
