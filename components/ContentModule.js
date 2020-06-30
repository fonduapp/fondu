import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image, Animated} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import host from '../constants/Server.js';
import { renderText } from '../constants/Helper.js'
import { withNavigation } from 'react-navigation';
import { longDayNames, shortMonthNames } from '../constants/Date.js';

const { width } = Dimensions.get('window');

class ContentModule extends Component {

	constructor(props){
		super(props)
	    this.state = {
	    	imgsrc:null,
	    	nextAssessDate:null,
	    	suggestions:[],
	    	contentType:"",
	    };

	    this.getSuggestions = this.getSuggestions.bind(this);
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

		if(this.props.contentType==="suggest"){
			this.getSuggestions()
		}

	}

	async componentDidUpdate(prevProps){
		if(this.props.contentType !== prevProps.contentType && this.props.contentType === 'suggest'){
			this.getSuggestions()
		}
	}

	areAllModulesDone(behaviors){
		return Object.keys(behaviors).every((k)=>{behaviors[k].completed})
	}

	async getSuggestions(){
		const {authToken, userId} = await _getAuthTokenUserId()

		//fetch article content
		console.log('http://' + host +':3000/behavior/' + userId + '/' + authToken + '/' + this.props.behaviorId)
		fetch('http://' + host +':3000/behavior/' + userId + '/' + authToken + '/' + this.props.behaviorId,{
		method: 'GET',
		headers: {
		  Accept: 'application/json',
		  'Content-Type': 'application/json',
		},
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({suggestions: renderText(responseJson.behavior_text, 'Suggestion')})
		})
		.catch((error) => {
		console.error(error);
		});

		
	}

  onPressLearnMore = () => {
    const {
      behaviorId,
      navigation,
    } = this.props;
    navigation.navigate(
      'Article',
      {
        behaviorId,
      },
    );
  };

	getModuleContent(){
		let moduleWidth = this.props.width
		let marginSide = this.props.space/2
		
		

		switch(this.props.contentType){

			case 'learn':
				return(
				  	<View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 40, backgroundColor: theme.SECONDARY_COLOR}]}>
					  <View style = {styles.textContainer}>
					  	<View style={{flex:1}}>
			              <Text style={[textStyle.subheader, { color: theme.TEXT_COLOR, opacity: 0.5}]}>{this.props.subtitle}</Text>
			              <Text style={[textStyle.header,{ color: theme.TEXT_COLOR}]}>{this.props.title}</Text>
			            </View>
			              <Text style={[textStyle.paragraph, {opacity: 0.5, color: theme.TEXT_COLOR, marginTop: 10, flex:1}]}>
			              	Regularly giving your partner hugs, touches and pats, hand-holding on a daily basis.
			              </Text>
		              </View>
		              <View style={styles.buttonContainer}>
			              <NextButton
			                onPress={this.props.onPress} 
			                title="Let's start"
			                buttonStyle = {styles.buttonStyle}/>
			              <NextButton
			                onPress={this.onPressLearnMore}
			                title="Learn more"
			                buttonStyle = {styles.buttonStyle2}
			                buttonTextStyle = {{color:theme.PRIMARY_COLOR}}/>
		               </View>
	               </View>
	            )
				break
			case 'check':

				let nextAssessDate = this.state.nextAssessDate!=null ? (longDayNames[this.state.nextAssessDate.getDay()] + " (" + shortMonthNames[this.state.nextAssessDate.getMonth()] + " " + this.state.nextAssessDate.getDate()) +")":""
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
				          		<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} key={index}>
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
			                buttonStyle = {styles.buttonStyleCheck}
			                disabled = {!modulesDone}
			               />
		               </View>
	               </View>
	            )
				break
			case 'suggest':
				return(
				  	<View style={[styles.welcomeSubContainer,{width: moduleWidth, marginHorizontal: marginSide, backgroundColor: theme.PRIMARY_COLOR, alignItems: 'flex-start'}]}>
					  <View style = {[styles.textContainer,{flex:1}]}>
			              <Text style={[textStyle.subheader, { color: 'white', opacity: 0.5}]}>{this.props.subtitle}</Text>
			              <Text style={[textStyle.header,{ color: 'white'}]}>{this.props.title}</Text>
		              </View>
		              <View style = {{flex:1, justifyContent:'flex-start'}}>
			              	<Text style={[textStyle.subheader, { color: 'white', opacity: 0.5, marginBottom: 10}]}>DIRECTIONS</Text>
			              {
			              	this.state.suggestions.map((suggestion,index)=>
			              	{
			              		return (
			              			<View key = {index} style={{flexDirection:'row', marginBottom: 5, width:'100%'}}>
			              				<Icon name='flag' color='white' width={20}/>
			              				<Text style={{...textStyle.caption, color: 'white', marginLeft:15, flexShrink: 1}}>{suggestion}</Text>
			              			</View>
			              			)
			              	})
			              }
		              </View>
		              <View style={[styles.buttonContainer,{alignSelf:'center'}]}>
			              <NextButton
			                onPress={this.onPressLearnMore}
			                title="Learn more"
			                buttonStyle = {{...styles.buttonStyle2, borderColor:'white'}}
			                buttonTextStyle = {{color:'white'}}/>
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
		flex:2,
	},
	textCheckContainer:{
		flex:2,
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

export default withNavigation(ContentModule);
