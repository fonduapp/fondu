import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image, Animated} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import host from '../constants/Server.js';
import { renderText } from '../constants/Helper.js'



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

	getSuggestions(){
		let content = '<Section>Support</Section><Subsection>Properly Giving Advice</Subsection><Description>Making sure the advice you give solves the issue, is delivered politely, and is asked for.</Description>'
 + '<Example>I think doing it will work because …, you can handle it because …, and it’s not too risky because…</Example>'+
'<Question>Does giving advice help my partner?</Question>'+
'<Answer>Often, giving advice can actually be harmful <isc>(MacGeorge, Feng, & Burleson, 2011)</isc>. This is because it may make individuals feel less competent and independent. However, if given properly, advice can be beneficial and help the individual better understand and deal with the situation. If the advice is asked for, delivered politely, and solves the issue, it is more likely to be received well and help your partner cope.</Answer>' +
'<Theory>Researchers have outlined some of the different factors affecting how advice is received in a theory called advice response theory <isc>(MacGeorge, Guntzviller, Hanasono, & Feng, 2016)</isc>. It takes into account the advice content, the qualities of the advice giver, how the advice is given, and more.</Theory>'+
'<Suggestion>Make sure your advice is wanted</Suggestion>'
+ '<Research>When advice is asked for, or permitted, it is more satisfying, more likely to be used, and the individual is less likely to get defensive (Van Swol, MacGeorge, & Prahl, 2017). It is essential to listen closely and make sure your partner actually wants advice. Giving advice without being prompted is a common mistake. </Research>'
+ '<Suggestion>Deliver the advice politely</Suggestion>' +
'<Research>When advice is given politely (i.e. with concern for the receivers feelings, modesty, does not challenge competence, or impose too much on the recipient), it is more likely to be perceived as higher quality, facilitate coping, and be utilized (MacGeorge, Feng, & Burleson, 2011). </Research>' +
'<Suggestion>Explain how your advice will solve the issue, why it’s feasible, and that it’s not too risky</Suggestion>'
+ '<Research>\n'+
'Research: The message content is extremely important to how it is received, maybe even more so than source characteristics or how politely it’s delivered (Feng & MacGeorge, 2010). After giving advice, discuss why it solves the issue, why your partner can handle it, and how it isn’t too risky. Your advice will be viewed more positively and your partner will be more likely to use it if it has these features.'
+ '</Research>\n'+
'<Reference>Feng, B., & Burleson, B. R. (2008). The effects of argument explicitness on responses to advice in supportive interactions. Communication Research, 35(6), 849-874.</Reference>' +
'<Reference>Feng, B., & MacGeorge, E. L. (2010). The influences of message and source factors on advice outcomes. Communication Research, 37(4), 553-575.</Reference>'
;
		let suggestion = renderText(content, 'answer')
		console.log(suggestion)
	}
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
			            {this.props.onPress2!=null?
			              <NextButton
			                onPress={this.props.onPress2}
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
			                buttonStyle = {styles.buttonStyleCheck}
			                disabled = {!modulesDone}
			               />
		               </View>
	               </View>
	            )
				break
			case 'suggest':

				this.getSuggestions();
				return(
				  	<View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 40, backgroundColor: theme.PRIMARY_COLOR}]}>
					  <View style = {[styles.textContainer,{flex:1}]}>
			              <Text style={[textStyle.subheader, { color: 'white', opacity: 0.5}]}>{this.props.subtitle}</Text>
			              <Text style={[textStyle.header,{ color: 'white'}]}>{this.props.title}</Text>
		              </View>
		              <View style = {[styles.textContainer,{flex:1}]}>
		              	<Text style={[textStyle.subheader, { color: 'white', opacity: 0.5,}]}>DIRECTIONS</Text>
			              <Text>direction</Text>
		              </View>
		              <View style={styles.buttonContainer}>
			              <NextButton
			                onPress={this.props.onPress}
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