import React, { Component } from 'react';
import { useState } from 'react';

import DropDownItem from 'react-native-drop-down-item';
import Modal from 'react-native-modal';
import ReferencePopUp from '../components/ReferencePopUp';
import ReportProbPopUp from '../components/ReportProbPopUp';
import { _getAuthTokenUserId } from '../constants/Helper.js'
import {
  Image,
  Icon,
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
          })
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
      console.log('updating ' + this.state.behaviorId)
      this.getArticle(this.state.userId,this.state.authToken,this.state.behaviorId)
      setState({newPage:false})
    }
  }

  switchScreens=(directions, answer, theory)=>{
    switch(this.state.screen){
      case 'direction':
        return(
          <View style = {[styles.researchContainer,{marginTop:20}]}>
          <View style = {[styles.directionContainer,{paddingLeft:20, paddingRight:20, paddingBottom:40}]}>
            <Text style = {styles.headerText}>DIRECTIONS</Text>
              <View style = {styles.container}>{directions}</View>
              </View>
              <TouchableOpacity
                style ={{paddingLeft:20, marginTop:20}}
                onPress = {() => this._showResearch()}>
                <Text style = {styles.headerText}>THE RESEARCH BEHIND IT</Text>
              </TouchableOpacity>
          </View>
        );
        break;
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
              <DropDownItem
                contentVisible = {false}
                header = {
                <View style = {{textAlign:'left',paddingTop:20}}>
                    <Text style = {styles.researchTitleText}>Additional Research</Text>
                </View>
              }>
              <Text style = {[styles.dropDownText, {color:'#425957'}]}>TODO</Text>
              </DropDownItem>
            </View>
          </View>
        </View>
        );
        break;
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
            <Image style = {styles.imageContainer2}></Image>
            <View style = {styles.instructionContainer}>
              <Text style = {styles.instructionText}>{dir}</Text>
            </View>
          </View>
        }
        >
        <Text style = {styles.dropDownText}>{res}</Text>
        </DropDownItem>
    });
    let articles = this.state.articleList.map((article,i) =>{
      console.log(article)
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
      <Image style = {styles.imageContainer}>
      </Image>
        <Text style ={[styles.descriptText, {textAlign:'center'}]}>
          {this.state.example}
        </Text>
      </View>

      <View>
        <Text style = {styles.headerLabel}>{this.state.question}</Text>
        <Text style = {styles.about}>{this.state.descript}</Text>
      </View>

      <View>
        {this.switchScreens(directions, answer, theory)}
      </View>


      <View>
      <TouchableOpacity
            onPress={()=>this.showProbReport()}>
              <Text>Report a Problem</Text>
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
        <Text style = {styles.headerLabel}>Related Articles</Text>
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
  textContainer: {
    color: '#7695FF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
},
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
    width: width*.4,
    height: width*.4,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: '#03A9F4',
  },

  imageContainer2:{
    width: width*.1,
    height: width*.1,
    margin:10,
    borderRadius: 10,
    paddingLeft:20,
    backgroundColor: '#03A9F4',
  },
  instructionContainer:{
    flex:10,
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

  aboutHeaderContainer:{
    alignItems: 'center',
    width: width/3*2,
    paddingBottom: 20,
    paddingTop: 20,
  },

  headerText:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft:30,
  },

  relatedArticleText:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign:'center',
  },
  researchTitleText:{
      paddingLeft:20,
      paddingBottom:20,
      fontSize:14,
      color: '#475279',
      fontWeight:'bold',
      justifyContent:'flex-start',
  },
  researchBodyText:{
    paddingLeft:20,
    color:'#475279',
    fontSize:12,
    lineHeight:18,
  },
  instructionText:{
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight:'bold',
    paddingTop:20,
  },
  dropDownText:{
    color: '#FFFFFF',
    fontSize: 15,
    paddingLeft:100,
  },
  aboutText:{
    color: '#475279',
    fontSize: 13,
    lineHeight:20,
    paddingTop:10,
    paddingLeft:50,
    paddingRight: 50,
  },

  headerLabel:{
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 50,
    paddingTop: mainPadding,
    color: '#475279',
  },
},);
