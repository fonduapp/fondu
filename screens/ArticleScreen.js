import React, { Component } from 'react';
import { useState } from 'react';
import {textStyle} from '../styles/text.style.js';
import DropDownItem from 'react-native-drop-down-item';

import Modal from 'react-native-modal';
import ReferencePopUp from '../components/ReferencePopUp';
import ReportProbPopUp from '../components/ReportProbPopUp';
import InfoButton from '../components/InfoButton';
import { shadowStyle } from '../styles/shadow.style.js';

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
import { createISC, getIcon, renderText, italicize } from '../utils/Helper.js'
import fetch, { _getAuthTokenUserId } from '../utils/Fetch.js';

//import theme from '../styles/theme.style.js';


const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const mainPadding = 30;
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>


export default class ArticleScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      finishedMounting:false,
      screen: 'direction',
      article_title: '',
      example: [],
      descript: [],
      question: [],
      answer: [],
      Theory: [],
      articleList:[],
      research:[],
      suggestion:[],
      reference:[],
      iscite:[],
      icons:[],
      reportProb: false,
      report:"",
      showRef: false,
      showInfo: false,
      behaviorId:'',
      userId:'',
      authToken:'',
      newPage:false,
      buttonClosed:[true,true,true],
    };
    this.screens.bind(this);
    this.createISC = createISC.bind(this);
    this.renderText = renderText.bind(this);
    this.getIcon = getIcon.bind(this);

  }

    _showDirections(){
      this.setState({ screen: 'direction'})
    }
    _showResearch(){
      this.setState({ screen:'research' })
    }
    closeTheory(){
      this.setState({showInfo:false})
    }

    openTheory(){
      this.setState({showInfo:true})
    }
    showProbReport = () => {
      this.setState({reportProb:true});
      console.log("problem state" + this.state.reportProb)
    }

    hideProbReport = () => {
      console.log("problem state" + this.state.report + "hello")
      if (this.state.report){
          fetch('POST', 'report', { report: this.state.report })
            .catch(console.error);
        }
        this.setState({reportProb:false});
    }
    handleReport = (text) => {
         this.setState({ report: text })
    }

    hideReferences = () => {
      this.setState({showRef:false});
    }
    changeColor=(i)=>{
      var temp = this.state.buttonClosed
      temp[i] = !temp[i]
      this.setState({buttonClosed:temp})
    }

    getArticle(userId, authToken, behaviorId){
      return fetch('GET', 'behavior', { behaviorId })
        .then((responseJson) =>{
          this.setState({
            article_title:responseJson.behavior_name,
            example: (this.renderText(responseJson.behavior_text, 'Example')),
            descript: [(this.renderText(responseJson.behavior_text, 'Description'))],
            question: (this.renderText(responseJson.behavior_text, 'Question')),
            answer: [(this.renderText(responseJson.behavior_text, 'Answer'))],
            Theory: [(this.renderText(responseJson.behavior_text, 'Theory'))],
            suggestion:(this.renderText(responseJson.behavior_text, 'Suggestion')),
            research:(this.renderText(responseJson.behavior_text, 'Research')),
            reference:this.renderText(responseJson.behavior_text, 'Reference'),
            icons:(this.renderText(responseJson.behavior_text, 'SuggestionIcon')),
            image: 'http://192.241.153.104:3000/behaviorImage/'+userId+'/'+authToken+'/' + behaviorId,
          })
        })
        .then(()=>
        fetch('GET', 'relatedBehaviors', { behaviorId })
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
        finishedMounting: true,
        behaviorId:this.props.navigation.state.params.behaviorId
      });
      this.getArticle(userId,authToken,this.state.behaviorId)

  }
  componentDidUpdate(){
    if (this.state.newPage == true){
      this.getArticle(this.state.userId,this.state.authToken,this.state.behaviorId)
      this.setState({newPage:false})
    }
  }


  showText( theory){
    if (!this.state.showInfo){
      return(
        <View>
      <Text style = {styles.dropDownText}>THE THEORY BEHIND IT</Text>
      <Icon
        name={'keyboard-arrow-down'}
        type='material'
        color='#FFFFFF'
        onPress={()=>this.openTheory()}
        size={30}/>
    </View>)
  }else{
    return(
    <View>
    <Text style = {styles.dropDownText}>THE THEORY BEHIND IT</Text>
    <Icon
      name={'keyboard-arrow-down'}
      type='material'
      color='#FFFFFF'
      onPress={()=>this.closeTheory()}
      size={30}/>
    <Text style = {styles.dropDownText}>{theory}</Text>
  </View>

)}
  }

  screens=(directions, answer, theory)=>{
        return(
          <View style = {[styles.researchContainer,{marginTop:20}]}>
          <View style = {[styles.directionContainer,{paddingLeft:20, paddingRight:20, paddingBottom:40}]}>
            <Text style = {styles.headerText}>DIRECTIONS</Text>
              <View style = {styles.container}>{directions}</View>
              </View>
          </View>
        );
    }

  render(){
    if (this.state.finishedMounting){
    let answer = this.createISC(this.state.answer, '<Answer>', '</Answer>');
    let theory = this.createISC(this.state.Theory, '<Theory>', '</Theory>');
    let caption = this.createISC(this.state.descript, '<Description>', '</Description>');
    let research = this.createISC(this.state.research, '<Research>', '</Research>');
    let directions = this.state.suggestion.map((dir,i) =>{
      var icons = this.getIcon(this.state.icons[i])
      return<InfoButton
      key={i}
        iconName= {icons[1]}
        iconType={icons[0]}
        label={dir}
        research = {research[i]}
        reference={this.state.reference}
      />
    });
    var articles;
    if (this.state.articleList){
     articles = this.state.articleList.map((article,i) =>{
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
}
  return(

    <View>
    <ScrollView style ={{height: height}}>
      <View style = {styles.container}>
      <Text style={styles.articleTitleText}>{this.state.article_title}</Text>
      <Image
      source={{uri:this.state.image}}
      style = {styles.imageContainer}
      >
      </Image>
        <View style={{marginLeft:width*.1, marginRight:width*.1}}>
        <Text style ={[styles.exampleText, {textAlign:'center', marginBottom:width*.1}]}>
          {caption}
        </Text>
        <Text style = {styles.questionText}>{this.state.question}</Text>
        <Text style = {styles.exampleText}>{answer}</Text>
        <View>
        {this.showText(theory)}
        </View>
      </View>
      </View>

      <View>
        {this.screens(directions, answer, theory)}
      </View>


      <View>
      <TouchableOpacity
            onPress={()=>this.showProbReport()}>
              <Text
              style={[styles.exampleText,{paddingTop:height*1/25,marginLeft:width*.1}]}>
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
          handleReport={this.handleReport}
          value={this.state.report}
        />
        <Text style = {styles.titleText}>Related Articles</Text>
            <View style = {styles.relatedArticle}>
                {articles}
            </View>
      </View>

    </ScrollView>
    </View>
    );
  }else{
    return null
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    color: '#7695FF',
  },
  directionContainer:{
    backgroundColor: '#7B80FF',
    borderRadius: 50,
    justifyContent:'space-between',
    paddingTop: 20,
    paddingLeft:width*1/5,
    paddingRight:width*1/5,
  },

  shadow:{
    backgroundColor: 'rgba(47, 52, 79, 0.5)',
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
    marginBottom:120,
  },

  researchContainer:{
    backgroundColor: '#F3F4FC',
    paddingBottom: 20,
   },

  shadowStyle: {
    ...shadowStyle.primaryShadowStyle,
  },

  headerText:{
    color: '#FFFFFF',
    ...textStyle.subheader,
    paddingBottom:20,
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
  researchBodyText:{
    paddingLeft:width*1/10,
    paddingRight:width*1/10,
    color:'#8393AD',
    ...textStyle.paragraph,
  },

  exampleText:{
    color: '#8393AD',
    ...textStyle.paragraph,
  },

  titleText:{
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 50,
    paddingTop: mainPadding,
    color: '#475279',
  },
  articleTitleText:{
    color: '#7B80FF',
    ...textStyle.header3,
    marginLeft:width*.1,
    marginRight: width*.1,
  },
});
