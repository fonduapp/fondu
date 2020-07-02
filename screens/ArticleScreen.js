import React, { Component } from 'react';
import { useState } from 'react';

import {textStyle} from '../styles/text.style.js';
import DropDownItem from 'react-native-drop-down-item';
import Modal from 'react-native-modal';
import ReferencePopUp from '../components/ReferencePopUp';
import ReportProbPopUp from '../components/ReportProbPopUp';
import { _getAuthTokenUserId } from '../constants/Helper.js'
import {Icon} from 'react-native-elements';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  Alert,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { createISC, renderText } from '../constants/Helper.js'


//import theme from '../styles/theme.style.js';


const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const mainPadding = 30;
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>


export default class ArticleScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      screen: 'direction',
      article_title: '',
      contents:[],
      example: [],
      descript: [],
      question: [],
      answer: [],
      Theory: [],
      article1: [],
      article2: [],
      articleList:[],
      research:[],
      suggestion:[],
      reference:[],
      iscite:[],
      icons:[],
      reportProb: false,
      showRef: false,
      behaviorId:'',
      userId:'',
      authToken:'',
      newPage:false,
    };
    this.switchScreens.bind(this);
    this.createISC = createISC.bind(this);
    this.renderText = renderText.bind(this);
  }

    _showDirections(){
      this.setState({ screen: 'direction'})
    }
    _showResearch(){
      this.setState({ screen:'research' })
    }
    showProbReport = () => {
      this.setState({reportProb:true});
      console.log("problem state" + this.state.reportProb)
    }
    hideProbReport = () => {
      this.setState({reportProb:false});
      console.log("problem state" + this.state.reportProb)
    }
    hideReferences = () => {
      this.setState({showRef:false});
      console.log("ref state" + this.state.showRef)
    }

    async getArticle(userId, authToken, behaviorId){
      const info_path = 'http://192.241.153.104:3000/behavior/'+userId+'/'+authToken+'/' + behaviorId;
      const rarticle_path = 'http://192.241.153.104:3000/relatedBehaviors/'+userId+'/'+authToken+'/' + behaviorId;

      return fetch(info_path)
        .then((response)=>response.json())
        .then((responseJson) =>{
          this.setState({
            article_title:responseJson.behavior_name,
            example: (this.renderText(responseJson.behavior_text, 'Example')),
            descript: (this.renderText(responseJson.behavior_text, 'Description')),
            question: (this.renderText(responseJson.behavior_text, 'Question')),
            answer: [(this.renderText(responseJson.behavior_text, 'Answer'))],
            Theory: [(this.renderText(responseJson.behavior_text, 'Theory'))],
            suggestion:(this.renderText(responseJson.behavior_text, 'Suggestion')),
            research:(this.renderText(responseJson.behavior_text, 'Research')),
            reference:(this.renderText(responseJson.behavior_text, 'Reference')),
            icons:(this.renderText(responseJson.behavior_text, 'SuggestionIcon')),
            image: 'http://192.241.153.104:3000/behaviorImage/'+userId+'/'+authToken+'/' + behaviorId,
          })
          console.log('icons')
          console.log(this.state.reference)

        })

        .then(()=>
        fetch(rarticle_path)
          .then((response)=>response.json())
          .then((response)=>JSON.parse(response['related_behaviors']))
          .then((responseJson) =>{
            this.setState({
              isLoading:false,
              articleList:responseJson
          })
        }))
      .catch((error)=>{
        console.log(error)
      });
  }
  async componentDidMount(){
      const {authToken, userId} = await _getAuthTokenUserId();
      this.setState({
        userId:userId,
        authToken:authToken,
        behaviorId:this.props.navigation.state.params.behaviorId
      });
      this.getArticle(userId,authToken,this.state.behaviorId)

  }
  async componentDidUpdate(){
    if (this.state.newPage == true){
      this.getArticle(this.state.userId,this.state.authToken,this.state.behaviorId)
      this.setState({newPage:false})
    }
  }

  switchScreens=(directions, answer, theory)=>{
    switch(this.state.screen){
      case 'direction':
        return(
          <View style = {[styles.researchContainer,{marginTop:20}]}>
          <View style = {[styles.directionContainer,{paddingLeft:20, paddingRight:20, paddingBottom:40}]}>
            <Text style = {[styles.headerText, {paddingBottom:20}]}>DIRECTIONS</Text>
              <View style = {styles.container}>{directions}</View>
              </View>
              <TouchableOpacity
                style ={{paddingLeft:20, marginTop:20}}
                onPress = {() => this._showResearch()}>
                <Text style = {styles.headerText}>THE RESEARCH BEHIND IT</Text>
              </TouchableOpacity>
          </View>
        );
      case 'research':
        return(
          <View style = {[styles.directionContainer, ,{marginTop:20}]} >
            <TouchableOpacity
              style = {{paddingLeft:20, marginBottom:20}}
              onPress = {() => this._showDirections()}>

              <Text style = {styles.headerText}>DIRECTIONS</Text>
            </TouchableOpacity>
            <View style = {[styles.researchContainer,{paddingTop:20}]}>
              <View style = {{paddingLeft:20}}>
                <Text style = {styles.headerText}>THE RESEARCH BEHIND IT</Text>
                </View>
            <View style ={styles.researchSubContainer}>
              <Text style = {styles.researchTitleText}>{this.state.question}</Text>
              <Text style = {styles.researchBodyText}>{answer}{'\n\n'}<B>Theory:</B> {theory}</Text>
            </View>
          </View>
        </View>
        );
        default:
          Alert.alert("SCREEN DNE");
    }
  }

  render(){
    let answer = this.createISC(this.state.answer, '<Answer>', '</Answer>');
    let theory = this.createISC(this.state.Theory, '<Theory>', '</Theory>');
    let research = this.createISC(this.state.research, '<Research>', '</Research>');
    let directions = this.state.suggestion.map((dir,i) =>{
      var res = research[i];
      return <DropDownItem
        key = {i}
        contentVisible = {false}
        header = {
          <View style = {styles.directionContainer2}>
            <Icon
              name={'mood'}
              type='material'
              color='#FFFFFF'
              containerStyle= {styles.iconContainer}
              size={30}>
              </Icon>
            <View style = {{flex:10}}>
              <Text style = {styles.suggestionText}>{dir}</Text>
            </View>
          </View>
        }
        >
        <Text style = {styles.dropDownText}>{res}</Text>
        </DropDownItem>
    });
    let articles = this.state.articleList.map((article,i) =>{
      return <TouchableOpacity
        style={styles.relatedArticleContainer}
        onPress={()=> this.setState({
          behaviorId:article['id'],
          newPage:true,
        })}
      >
      <Text style = {styles.relatedArticleText}>{article['name']}</Text>
      </TouchableOpacity>
  });
  return(

    <View>
    <ScrollView style ={{height: Dimensions.get('window').height}}>

      <View style = {styles.container}>
      <Image
      source={{uri:this.state.image}}
      style = {styles.imageContainer}
      >
      </Image>
        <View style={{marginLeft:width*.1, marginRight:width*.1}}>
        <Text style ={[styles.exampleText, {textAlign:'center', marginBottom:width*.1}]}>
          {this.state.example}
        </Text>
        <Text style = {styles.questionText}>{this.state.question}</Text>
        <Text style = {styles.exampleText}>{this.state.descript}</Text>
      </View>
      </View>

      <View>
        {this.switchScreens(directions, answer, theory)}
      </View>


      <View>
      <TouchableOpacity
            onPress={()=>this.showProbReport()}>
              <Text
              style={[styles.exampleText,{marginLeft:width*.1}]}>
              Report a Problem</Text>
        </TouchableOpacity>

        <ReferencePopUp
          showRef = {this.state.showRef}
          refs = {this.state.reference}
          hide ={this.hideReferences}
          />

        <ReportProbPopUp
          isVisible = {this.state.reportProb}
          hide ={this.hideProbReport}
        />
        <Text style = {styles.titleText}>Related Articles</Text>
        <View style = {styles.welcomeContainerContainer}>
            <View style = {styles.relatedArticle}>
                {articles}
            </View>
        </View>
      </View>

    </ScrollView>
    </View>
    );

  }
}

ArticleScreen.navigationOptions = {
  title: 'Article',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    color: '#7695FF',
  },
  directionContainer:{
    backgroundColor: '#FF7D71',
    borderRadius: 50,
    paddingTop: 20,
  },
  directionContainer2:{
    flexDirection:'row',
    justifyContent:'space-around',
    width: width,
    paddingTop:10,
    paddingLeft:50,
    paddingRight:25,

  },
  containerTitle:{
    flex: 1,
    color: '#7695FF',
    textAlign:'center',
    alignItems: 'center',
    paddingTop: mainPadding,
  },
  imageContainer:{
    width: width*.6,
    height: width*.6,
    borderRadius: 30,
  },

  iconContainer:{
    marginRight:20,
  },

  relatedArticleContainer:{
    backgroundColor:'#7B80FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width/11*4,
    height: width/11*4,
    margin: 10,
    borderRadius:10,
  },

  relatedArticle:{
    flex:1,
    flexDirection: 'row',
    textAlign:'center',
    justifyContent: 'space-evenly',
  },
  researchContainer:{
    backgroundColor: '#FFCA41',
    paddingBottom: 20,
    borderRadius: 50,
   },
   researchSubContainer:{
     paddingRight: 30,
     backgroundColor: 'rgba(255, 255, 255, 0.5)',
     borderRadius: 20,
     padding: 10,
     paddingTop:20,
     margin:20,
   },

  shadowStyle: {
    shadowRadius: 10,
    shadowOpacity: .2,
  },

  headerText:{
    color: '#FFFFFF',
    ...textStyle.subheader,
    paddingLeft:30,
  },
  questionText:{
    color: '#475279',
    ...textStyle.header4,
  },

  relatedArticleText:{
    color: '#FFFFFF',
    ...textStyle.label,
    textAlign:'center',
  },
  researchTitleText:{
      paddingLeft:20,
      marginBottom:height*.025,
      color: '#475279',
      ...textStyle.subheader,
      justifyContent:'flex-start',
  },
  researchBodyText:{
    paddingLeft:20,
    color:'#475279',
    lineHeight:18,
    ...textStyle.paragraph2,
  },

  exampleText:{
    color: '#475279',
    ...textStyle.paragraph,
  },
  suggestionText:{
    color: '#FFFFFF',
    flex:5,
    ...textStyle.subheader2,
  },
  dropDownText:{
    color: '#FFFFFF',
    ...textStyle.paragraph,
    marginRight:width*.1,
    marginLeft:width*.1,

  },

  titleText:{
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 50,
    paddingTop: mainPadding,
    color: '#475279',
  },
});
