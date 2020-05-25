import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions,} from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';

const { width } = Dimensions.get('window');

export default class ContentModule extends Component {

	render() {
		return (
	        <View>
                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainHeaderText}>{this.props.title}</Text>
                  <Text style={styles.mainParagraphText}>The definition of the behavior here</Text>

                </View>
                <NextButton
                    onPress={this.props.onPress} 
                    title="Let's start"
                    buttonStyle = {styles.buttonStyle}/>
            </View>
		);
	}
}

const styles = StyleSheet.create({
	buttonStyle:{
		position:'relative', 
		top:-40, alignSelf: 'center', 
		backgroundColor: theme.PRIMARY_COLOR, 
		width: '60%'

	},
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
	},
	welcomeSubContainer:{
	    width: 300,
	    height: 300,
	    alignItems: 'center',
	    backgroundColor: theme.SECONDARY_COLOR,
	    marginLeft: (width - 300)/6,
	    marginRight: (width - 300)/6,
	    marginBottom: 15,
	    borderRadius: 40,

  	},
  	mainImageContainer:{
	    width: width/3,
	    height:width/3,
	    backgroundColor: '#F2F2F2',
	    margin: 30,
	  },
	mainHeaderText:{
	    fontSize: 20,
	    fontWeight: 'bold',
	    color: theme.TERTIARY_COLOR,
	  },
	mainParagraphText:{
    fontSize: 15,
    color: theme.TERTIARY_COLOR,
  },

});