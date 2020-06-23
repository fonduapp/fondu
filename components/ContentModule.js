import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image, Animated} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import host from '../constants/Server.js';
import ViewOverflow from 'react-native-view-overflow';


const { width } = Dimensions.get('window');

export default class ContentModule extends Component {

	constructor(props){
		super(props)
	    this.state = {
	    	imgsrc:null,
	    	nextAssessDate:null,
	    };
	}

	async componentDidMount(){
		
		const {authToken, userId} = await _getAuthTokenUserId();

		let imgsrc = 'http://'+host+':3000/behaviorImage/' +userId + '/' + authToken+'/' + this.props.behaviorId
		console.log(imgsrc)
		this.setState({imgsrc:imgsrc});

		//get next reassess date
		fetch('http://' + host +':3000/nextAssessDate/' + userId + '/' + authToken,{
		method: 'GET',
		headers: {
		  Accept: 'application/json',
		  'Content-Type': 'application/json',
		},
		})
		.then((response) => response.json())
		.then((responseJson) => {
		this.setState({
		  nextAssessDate: new Date(responseJson.next_assess_date),
		});
		})
		.catch((error) => {
		console.error(error);
		});

	}

	areAllModulesDone(behaviors){
		return Object.keys(behaviors).every((k)=>{behaviors[k].completed})
	}

	getModuleContent(){

		let moduleWidth = this.props.width
		let marginSide = this.props.space/2
		
		

		switch(this.props.contentType){

			case 'learn':
				return(
				  	<View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 40, backgroundColor: theme.SECONDARY_COLOR}]}>
					  <View style = {styles.textContainer}>
			              <Text style={[textStyle.subheader, { color: theme.TEXT_COLOR, opacity: 0.5}]}>{this.props.subtitle}</Text>
			              <Text style={[textStyle.header,{ color: theme.TEXT_COLOR}]}>{this.props.title}</Text>
			              <Text style={[textStyle.paragraph, {opacity: 0.5, color: theme.TEXT_COLOR, marginTop: 10}]}>
			              	Regularly giving your partner hugs, touches and pats, hand-holding on a daily basis.
			              </Text>
		              </View>
		              <View style={styles.buttonContainer}>
			              <NextButton
			                onPress={this.props.onPress} 
			                title="Let's start"
			                buttonStyle = {styles.buttonStyle}/>
			            {this.props.onPress2!=null?
			              <NextButton
			                onPress={this.props.onPress}
			                title="Learn more"
			                buttonStyle = {styles.buttonStyle2}
			                buttonTextStyle = {{color:theme.PRIMARY_COLOR}}/>
			              :null
			            }
		               </View>
	               </View>
	            )
				break
			case 'check':

				const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
									  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
									]
				const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
				
				let nextAssessDate = this.state.nextAssessDate!=null ? (dayNames[this.state.nextAssessDate.getDay()] + " (" + monthNames[this.state.nextAssessDate.getMonth()] + " " + this.state.nextAssessDate.getDate()) +")":""
				let modulesDone = this.areAllModulesDone(this.props.behaviors)
				return(
				  	<View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 40, backgroundColor: theme.PRIMARY_COLOR_4}]}>
				      <View style = {styles.textCheckContainer}>
				      	  <View style={{backgroundColor:theme.PRIMARY_COLOR_5, borderRadius: 30, padding:5}}>
				      	  	<Icon name='flag' color={theme.PRIMARY_COLOR_4} size = {50}/>
				      	  </View>
				          <Text style={[textStyle.header,{ color: theme.TEXT_COLOR, marginTop: 20}]}>{this.props.title}</Text>
				          <Text style={[textStyle.subheader, { color: theme.PRIMARY_COLOR_5, opacity: 0.5}]}>{this.props.subtitle}</Text>
				          <View style= {{marginTop: 20}}>
				          	{ Object.keys(this.props.behaviors).map((behaviorId, index)=>{
				          		return(
				          		<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
					          		<Text style={[textStyle.subheader, { color: theme.PRIMARY_COLOR_5, marginRight: 30}]}>{this.props.behaviors[behaviorId].name}</Text>
					          		<Icon name={this.props.behaviors[behaviorId].completed?'check-box':'check-box-outline-blank'} color={theme.PRIMARY_COLOR_5}/>
				          		</View>
				          		)
				          		})
				          	}
				          	
				          </View>
		              </View>
		              <View style={styles.buttonContainer}>
			              <NextButton
			                onPress={this.props.onPress} 
			                title={modulesDone ? "Let's start":"Unlocks on " + nextAssessDate}
			                buttonStyle = {modulesDone ? styles.buttonStyleCheck : styles.buttonStyleLocked}/>
		               </View>
	               </View>
	            )
				break


		}
	}

	render() {
		
		return (
			<View style = {{flex:1}}>
	            {this.getModuleContent()}
	            <Animated.View style={[styles.mainImageContainer,{opacity:this.props.imageOpacity}]}>
	            	<Image source={{uri:this.state.imgsrc}} style={styles.imageStyle}/>
	            </Animated.View>
            </View>
                
		);
	}
}

const styles = StyleSheet.create({
	textContainer:{
		alignItems:'flex-start',
		alignSelf:'flex-start',
		width: 180,
		flex:1,
	},
	textCheckContainer:{
		flex:1,
		alignItems: 'center', 
		width: 180,
	},
	buttonContainer:{
		flex:1,
		alignItems: 'center', 
		justifyContent:'center'
	},
	buttonStyle:{
		position:'relative', 
		alignSelf: 'center', 
		backgroundColor: theme.PRIMARY_COLOR, 
		width: 200,
		marginBottom: 10,

	},
	buttonStyle2:{
		position:'relative', 
		alignSelf: 'center', 
		backgroundColor: 'transparent',
		borderColor : theme.PRIMARY_COLOR,
		borderWidth: 2,
		width: 200,
		elevation: 0,
	},
	buttonStyleCheck:{
		position:'relative', 
		alignSelf: 'center', 
		width: 200,
	},
	buttonStyleLocked:{
		position:'relative', 
		alignSelf: 'center', 
		backgroundColor : theme.INACTIVE_COLOR,
		width: 200,
	},
	welcomeSubContainer:{
	    alignItems: 'center',
	    backgroundColor: theme.SECONDARY_COLOR,
	    borderTopLeftRadius: 20,
	    borderTopRightRadius: 20,
	    padding:40,
	    flex: 1,
	    elevation: 1,
	    zIndex: 1,

  	},
  	imageStyle:{
  		width: 150,
	    height:150,
  	},
  	mainImageContainer:{
	    width: 150,
	    height:150,
	    margin: 10,
	    position: 'absolute',
	    right: -40,
	    elevation: 2,
	    zIndex: 2,
	    top:40,
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
	checkBox:{
		position: 'relative',
		top: 0,

	}
});