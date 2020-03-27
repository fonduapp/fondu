import React, { Component } from 'react';
import DropDownItem from 'react-native-drop-down-item';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  Alert,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
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
      article_title: 'Affectionate Touch',
      caption: '"Giving your partner a hug before a stressful situation"',
      question: 'What is Affectionate Touch?',
      about: 'Regularly giving your partner hugs, touches and pats, hand-holding on a daily basis.',
      researchText: 'Isn’t just telling my partner that I love them enough?',
      researchDescription: 'Affectionately touching our partners is highly correlated with relationship satisfaction. Not having enough affectionate touch may cause a relationship to end (1). ',
      researchTheory: 'Human touch has biological effects, and affectionate touch has been shown to increase oxytocin and reduce cortisol (stress hormone).',
      article1: "Affectionate Communication",
      article2: "Affectionate Touch",
      directionList:[
        {
          instruction: 'Affectionately touch your partner regularly.',
          additionalText: 'TODO'
        },
        {
          instruction: 'Softly stroke your partner’s arms or legs.',
          additionalText: "TODO"
        },
      ]
    }
    this.switchScreens.bind(this)

  }
    _showDirections(){
      this.setState({ screen: 'direction'})
    }

    _showResearch(){
      this.setState({ screen:'research' })
    }


  switchScreens=(directions)=>{
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
              <Text style = {styles.researchTitleText}>{this.state.researchText}</Text>
              <Text style = {styles.researchBodyText}>{this.state.researchDescription}{'\n\n'}<B>Theory:</B> {this.state.researchTheory}</Text>
              <DropDownItem
                contentVisible = {false}
                header = {
                <View style = {{textAlign:'left',paddingTop:20}}>
                    <Text style = {styles.researchTitleText}>Additional Research</Text>
                </View>
              }
              >
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
    let directions = this.state.directionList.map((dir,i) =>{
      return <DropDownItem
        key = {i}
        contentVisible = {false}
        header = {
          <View style = {styles.directionContainer2}>
            <Image style = {styles.imageContainer2}></Image>
            <View style = {styles.instructionContainer}>
              <Text style = {styles.instructionText}>{dir.instruction}</Text>
            </View>
          </View>
        }
        >
        <Text style = {styles.dropDownText}>{dir.additionalText}</Text>
        </DropDownItem>
    });
  return(
    <View>
    <ScrollView style ={{height: Dimensions.get('window').height}}>

      <View style = {styles.container}>
      <Image style = {styles.imageContainer}>
      </Image>
        <Text style ={[styles.aboutText, {textAlign:'center'}]}>
          {this.state.caption}
        </Text>
      </View>

      <View>
        <Text style = {styles.headerLabel}>{this.state.question}</Text>
        <Text style = {styles.aboutText}>{this.state.about}</Text>
      </View>

      <View>
        {this.switchScreens(directions)}
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


},);
