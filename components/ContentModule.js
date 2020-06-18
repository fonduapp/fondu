import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import host from '../constants/Server.js';

const { width } = Dimensions.get('window');

export default class ContentModule extends Component {

	constructor(props){
		super(props)
	    this.state = {
	    	imgsrc:""

	    };
	}

	async componentDidMount(){
		
		const {authToken, userId} = await _getAuthTokenUserId();

		let imgsrc = 'http://'+host+':3000/behaviorImage/' +userId + '/' + authToken+'/' + this.props.behaviorId//this.props.behaviorID
		console.log(imgsrc)
		this.setState({imgsrc:imgsrc});

	}

	render() {
		//const {authToken, userId} = await _getAuthTokenUserId()
		
		
		return (
	        <View>
                <View style={styles.welcomeSubContainer}>
                  <Image source={{uri:this.state.imgsrc}} style={styles.mainImageContainer}/>
                  <Text style={[textStyle.header2,{textAlign:'center', color: theme.TEXT_COLOR}]}>{this.props.title}</Text>
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
	welcomeSubContainer:{
	    width: 300,
	    height: 300,
	    alignItems: 'center',
	    backgroundColor: theme.SECONDARY_COLOR,
	    marginLeft: (width - 300)/6,
	    marginRight: (width - 300)/6,
	    marginBottom: 15,
	    borderRadius: 40,
	    padding:40,

  	},
  	mainImageContainer:{
	    width: width/3,
	    height:width/3,
	    margin: 10,
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