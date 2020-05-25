import React, { Component } from 'react';
import { useState } from 'react';

import DropDownItem from 'react-native-drop-down-item';
import Modal from 'react-native-modal';
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
const content = '<Section>Support</Section><Subsection>Properly Giving Advice</Subsection><Description>Making sure the advice you give solves the issue, is delivered politely, and is asked for.</Description>'
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

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const mainPadding = 30;
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>


export default class ArticleScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      screen: 'direction',
      content: '<Section>Support</Section><Subsection>Properly Giving Advice</Subsection><Description>Making sure the advice you give solves the issue, is delivered politely, and is asked for.</Description>'
       + '<Example>I think doing it will work because …, you can handle it because …, and it’s not too risky because…</Example>'+
      '<Question>Does giving advice help my partner?</Question>'+
      '<Answer>Often, giving advice can actually be harmful <isc>(MacGeorge, Feng, & Burleson, 2011)</isc>. This is because it may make individuals feel less competent and independent. However, if given properly, advice can be beneficial and help the individual better understand and deal with the situation. If the advice is asked for, delivered politely, and solves the issue, it is more likely to be received well and help your partner cope.</Answer>' +
      '<Theory>Researchers have outlined some of the different factors affecting how advice is received in a theory called advice response theory <isc>(MacGeorge, Guntzviller, Hanasono, & Feng, 2016)</isc>. It takes into account the advice content, the qualities of the advice giver, how the advice is given, and more.</Theory>'+
      '<Suggestion>Make sure your advice is wanted</Suggestion>'
      + '<Research>When advice is asked for, or permitted, it is more satisfying, more likely to be used, and the individual is less likely to get defensive <isc>(Van Swol, MacGeorge, & Prahl, 2017)</isc>. It is essential to listen closely and make sure your partner actually wants advice. Giving advice without being prompted is a common mistake. </Research>'
      + '<Suggestion>Deliver the advice politely</Suggestion>' +
      '<Research>When advice is given politely (i.e. with concern for the receivers feelings, modesty, does not challenge competence, or impose too much on the recipient), it is more likely to be perceived as higher quality, facilitate coping, and be utilized (MacGeorge, Feng, & Burleson, 2011).</Research>' +
      '<Suggestion>Explain how your advice will solve the issue, why it’s feasible, and that it’s not too risky</Suggestion>'
      + '<Research>Research: The message content is extremely important to how it is received, maybe even more so than source characteristics or how politely it’s delivered (Feng & MacGeorge, 2010). After giving advice, discuss why it solves the issue, why your partner can handle it, and how it isn’t too risky. Your advice will be viewed more positively and your partner will be more likely to use it if it has these features.</Research>'+
      '<Reference>Feng, B., & Burleson, B. R. (2008). The effects of argument explicitness on responses to advice in supportive interactions. Communication Research, 35(6), 849-874.</Reference>',

      article_title: '',
      contents:[],
      example: [],
      descript: [],
      question: [],
      answer: [],
      Theory: [],
      article1: '',
      article2: '',
      research:[],
      suggestion:[],
      reference:[],
      iscite:[],
      reportProb: false,
      showRef: false,
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
//show and hide reference popup
    show = () => {
      this.setState({showRef:true});
      console.log("ref state" + this.state.showRef)
    }
    hide = () => {
      this.setState({showRef:false});
      console.log("ref state" + this.state.showRef)
    }

    //const {behaviorId} = this.props.route.params
    componentDidMount(){
      const info_path = 'http://192.241.153.104:3000/behavior/2/abcdefg/1/'
      const rarticle_path = 'http://192.241.153.104:3000/relatedBehaviors/2/abcdefg/5'

      return fetch('http://192.241.153.104:3000/behavior/2/abcdefg/1/')
        .then((response)=>response.json())
        .then((responseJson) =>{
          this.setState({
            article_title:responseJson.behavior_name,
            example: (this.renderText(this.state.content, 'example'))[1],
            descript: (this.renderText(this.state.content, 'descript'))[1],
            question: (this.renderText(this.state.content, 'question'))[1],
            answer: [(this.renderText(this.state.content, 'answer'))[1]],
            Theory: [(this.renderText(this.state.content, 'theory'))[1]],
            suggestion:(this.renderText(this.state.content, 'suggestion')),
            research:(this.renderText(this.state.content, 'research')),
            reference:(this.renderText(this.state.content, 'ref')),
          })
        }).then(()=>
        fetch(rarticle_path)
          .then((response)=>response.json())
          .then((responseJson) =>{
          this.setState({
            isLoading:false,
            article1:responseJson.name,
            article2:responseJson.name,
          })
    })
    ).catch((error)=>{
    console.log(error)
 });
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
    let references = this.state.reference.map((ref,i) =>{
      ref = ref.replace('<Reference>', '');
      ref = ref.replace('</Reference>', '');
      return <Text>{ref}</Text>
    })

    var show = false;
    let answer = this.createISC(this.state.answer, '<Answer>', '</Answer>', show);
    let theory = this.createISC(this.state.Theory, '<Theory>', '</Theory>', show);
    let research = this.createISC(this.state.research, '<Research>', '</Research>', show);
    let directions = this.state.suggestion.map((dir,i) =>{
      dir = dir.replace('<Suggestion>','');
      dir = dir.replace('</Suggestion>','');
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
            onPress={()=>probscreen.showProbReport()}>
              <Text>Report a Problem</Text>
        </TouchableOpacity>

        <Modal
        style = {styles.modalContainer}
        isVisible = {this.state.showRef}
        onBackdropPress={()=>this.hide()}
>
          <View>
            <Text style={[styles.problemText,{fontSize: 18, textAlign:'center'}]}>{references}</Text>
          </View>
        </Modal>


        <Modal
        style = {styles.modalContainer}
        isVisible = {this.state.reportProb}
        onBackdropPress={()=>this.hideProbReport()}
>
          <View>
            <Text style={[styles.problemText,{fontSize: 18, textAlign:'center'}]}>Report a Problem</Text>
            <Text style={styles.problemText}>Description</Text>
            <TextInput
            style = {styles.problemInput}
            multiline
            numberOfLines={6}
            />
            <TouchableOpacity
            style = {styles.submitButton}>
              <Text style = {{fontWeight:'bold', color:'#FFFFFF'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        </View>

        <View>
        <Text style = {styles.headerLabel}>Related Articles</Text>
        <View style = {styles.welcomeContainerContainer}>
            <View style = {styles.relatedArticle}>
                <View style={styles.relatedArticleContainer}>
                <Text style = {styles.relatedArticleText}>{this.state.article1}</Text>
                </View>
                <View style={styles.relatedArticleContainer}>
                <Text style = {styles.relatedArticleText}>{this.state.article2}</Text>
                </View>
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

  //problem report pop up styling
  problemText:{
    color: '#7B80FF',
    fontWeight:'bold',
    fontSize: 16,
    lineHeight:20,
    marginBottom:20,

  },

  problemInput:{
    backgroundColor:'#EAEEFF',
    borderRadius: 10,
    padding:width/16,
    paddingTop:width/16,

    textAlignVertical: "top",
    height: width*5/12,
    justifyContent:'flex-start',

  },
  modalContainer:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingLeft:width/16,
    paddingRight:width/16,
    paddingTop: width/16,
    width: width*3/4,
    maxHeight: height*1/2,
    top: height/4,
    left: width*1/8,
    justifyContent:'flex-start'
  },

  submitButton:{
    backgroundColor: '#7B80FF',
    borderRadius:50,
    justifyContent:'center',
    marginTop:15,
    padding:5,
    paddingLeft:20,
    paddingRight:20,
    alignSelf:'flex-end',
  },



},);
