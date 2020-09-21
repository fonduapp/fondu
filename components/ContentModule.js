import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image, Animated} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import { Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import host from '../constants/Server.js';
import { renderText, getIcon } from '../utils/Helper.js'
import { withNavigation } from 'react-navigation';
import { longDayNames, shortMonthNames } from '../constants/Date.js';
import fetch, { _getAuthTokenUserId } from '../utils/Fetch';

const { width } = Dimensions.get('window');

class ContentModule extends Component {

    constructor(props){
        super(props)
        this.state = {
            imgsrc:null,
            suggestions:[],
            contentType:"",
            description: '',
            icons:[],
        };

        this.getArticleText = this.getArticleText.bind(this);
        this.getIcon = getIcon.bind(this);
    }

    async componentDidMount(){
        
        const {authToken, userId} = await _getAuthTokenUserId();

        let imgsrc = 'http://'+host+':3000/behaviorImage/' +userId + '/' + authToken+'/' + this.props.behaviorId
        console.log(imgsrc)
        this.setState({imgsrc:imgsrc});

        this.getArticleText()

    }

    componentDidUpdate(prevProps){
        if(this.props.contentType !== prevProps.contentType){
            this.getArticleText()
        }
    }

    getArticleText(){
        const { contentType, behaviorId } = this.props;
        let property;
        let tag;
        switch (contentType) {
          case 'suggest':
            property = 'suggestions';
            tag = 'Suggestion';
            break;
          case 'learn':
            property = 'description';
            tag = 'Description';
            break;
          default:
            // do nothing
            return;
        }

        //fetch article content
        fetch('GET', 'behavior', { behaviorId })
          .then((responseJson) => {
              this.setState({[property]: renderText(responseJson.behavior_text, tag)})
              if (contentType === 'suggest'){
                  //get icons
                  this.setState({icons:renderText(responseJson.behavior_text, 'SuggestionIcon')})
              }
          })
          .catch(console.error);

        
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

  onPressChangeAssessDay = () => {
    const { navigation } = this.props;
    navigation.navigate(
      'Profile',
      {
        focusCheckpointDay: true,
      },
    );
  };

    getModuleContent(){
    const { description } = this.state;
        let moduleWidth = this.props.width
        let marginSide = this.props.space/2
        
        

        switch(this.props.contentType){

            case 'learn':
                return(
                    <View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 20, backgroundColor: theme.SECONDARY_COLOR}]}>
                      <View style = {styles.textContainer}>
                        <View style={{flex:1}}>
                          <Text style={[textStyle.header,{ color: theme.TEXT_COLOR}, styles.titleText]}>{this.props.title}</Text>
                        </View>
                          <Text style={[textStyle.paragraph, {opacity: 0.5, color: theme.TEXT_COLOR, marginTop: 10, flex:1}]}>
                            {description}
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
                const { nextAssessDate } = this.props;
                let nextAssessDateString = nextAssessDate!=null ? (longDayNames[nextAssessDate.getDay()] + " (" + shortMonthNames[nextAssessDate.getMonth()] + " " + nextAssessDate.getDate()) +")":""
                const { unlockReview } = this.props;
                return(
                    <View style={[styles.welcomeSubContainer,{width: moduleWidth, marginLeft: marginSide, marginRight: marginSide,  paddingTop: 40, backgroundColor: theme.PRIMARY_COLOR_4}]}>
                      <View style = {styles.textCheckContainer}>
                          <View style={{backgroundColor:theme.PRIMARY_COLOR_5, borderRadius: 30, padding:5}}>
                            <Icon name='flag' color={theme.PRIMARY_COLOR_4} size = {50}/>
                          </View>
                          <Text style={[textStyle.header,{ color: theme.TEXT_COLOR, marginTop: 20}]}>{this.props.title}</Text>
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
                            title={unlockReview ? "Let's start":"Unlocks on " + nextAssessDateString}
                            buttonStyle = {styles.buttonStyleCheck}
                            disabled = {!unlockReview}
                           />
                     <View
                       marginTop={10}
                       alignItems="center"
                     >
                       <Text style={styles.changeAssessDayText}>
                         Does this day not work for you?
                       </Text>
                       <TouchableOpacity onPress={this.onPressChangeAssessDay}>
                         <Text style={[
                           styles.changeAssessDayText,
                           textStyle.label,
                         ]}>
                           Choose another day
                         </Text>
                       </TouchableOpacity>
                     </View>
                       </View>
                   </View>
                )
                break
            case 'suggest':
                return(
                    <View style={[styles.welcomeSubContainer,{width: moduleWidth, marginHorizontal: marginSide, paddingTop: 20, backgroundColor: theme.PRIMARY_COLOR, alignItems: 'flex-start'}]}>
                      <View style = {[styles.textContainer,{flex:1}]}>
                          <Text style={[textStyle.header,{ color: 'white'}, styles.titleText]}>{this.props.title}</Text>
                      </View>
                      <View style = {{flex:1, justifyContent:'flex-start'}}>
                            <Text style={[textStyle.subheader, { color: 'white', opacity: 0.5, marginBottom: 10}]}>DIRECTIONS</Text>
                          {
                            this.state.suggestions.map((suggestion,index)=>
                            {   if(this.state.icons.length>0){
                                console.log(this.getIcon(this.state.icons[index]))
                                }
                                return (
                                    <View key = {index} style={{flexDirection:'row', marginBottom: 5, width:'100%'}}>
                                        <Icon name={this.state.icons.length>0?this.getIcon(this.state.icons[index])[1]:null}
                                              type={this.state.icons.length>0?this.getIcon(this.state.icons[index])[0]:null}
                                              color='white' 
                                              size={20}/>
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
                    <Image source={this.state.imgsrc?{uri:this.state.imgsrc}:null} style={styles.imageStyle}/>
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
        shadowOpacity: 0,
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
        paddingVertical:40,
      paddingHorizontal: 30,
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
        top:20,
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

    },
  changeAssessDayText: {
    ...textStyle.caption,
    color: theme.TEXT_COLOR,
    opacity: 0.5,
  },
  titleText: {
    marginTop: 24,
  },
});

export default withNavigation(ContentModule);
