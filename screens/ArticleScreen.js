import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
//import theme from '../styles/theme.style.js';

const { width } = Dimensions.get('window');
const mainPadding = 30;



export default class ArticleScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      article1: 'Asking for Support',
      article2: 'Initiating Fun Activites',

      qText: 'Next time I feel the need to make my partner jealous I will…',
      response1: 'Distance myself from my partner',
      response2: 'Plan a fun activity with my partner',
      response3: 'Arrange to meet with my partner to discuss my feelings',

      descriptionText: 'Jealousy induction is the \ tactic of making a partner jealous on purpose, \whether it be for relational rewards or for \ relational revenge (1). There are multiple methods \individuals may induce jealousy including \ distancing, flirting, and presenting alternative \ partners(1).',
      researchText: 'Though jealousy is not \ necessarily a bad thing, and reactive jealousy can \ indicate a high relationship quality (2),\ purposefully inducing jealousy can harm a \ relationship. Relationships with jealous \ individuals have reported lower relationship\ quality, and jealousy is associated with many\ negative outcomes such as relationship conflict,\ domestic violence, and divorce (3).',
      suggestionText: 'Instead of inducing jealousy\ in order to get relational rewards (feel more\ confident, need to feel cared for, feel in power),\ there are alternative ways to get these same\ rewards from your partner. Planning a fun outing\ with your partner produces similar results (4), or\ just telling your partner that you are in need of\ support (5).',

    };
  }
  render(){
  return(
    <View style = {styles.container}>

    <ScrollView>
      <View style = {styles.containerTitle}>
        <Text style = {styles.textContainer}>Jealousy Induction</Text>
      </View>
      <View style = {styles.imageContainer}>
        <Image
          style = {{width: width/8*7, height: width/2,}}
          source = {'https://upload.wikimedia.org/wikipedia/commons/d/d8/Swiss_fondue.jpg'}
        />
        </View>

      <View>
        <Text style = {styles.headerLabel}>Description</Text>
        <Text style = {styles.contentLabel}>{this.state.descriptionText}</Text>
      </View>

      <View>
        <Text style = {styles.headerLabel}>Research</Text>
        <Text style = {styles.contentLabel}>{this.state.researchText}</Text>
      </View>

      <View>
        <Text style = {styles.headerLabel}>Suggestion</Text>
        <Text style = {styles.contentLabel}>{this.state.suggestionText}</Text>
      </View>
      <View style={styles.welcomeContainerContainer}>
          <View style={[styles.welcomeContainer, styles.shadowStyle]}>
            <View style = {styles.questionContainer}>
                <Text style={styles.questionText}>{this.state.qText}</Text>
            </View>
            <View style = {styles.responseContainer}>
                <Text style = {styles.responseText}>{this.state.response1}</Text>
            </View>
            <View style = {styles.responseContainer}>
                <Text style = {styles.responseText}>{this.state.response2}</Text>
            </View>
            <View style = {styles.responseContainer}>
                <Text style = {styles.responseText}>{this.state.response3}</Text>
            </View>
           </View>
      </View>

      <View>
        <Text style = {styles.headerLabel}>Related Articles</Text>
        <View style = {styles.welcomeContainerContainer}>
            <View style = {styles.relatedArticle}>
                <View style={[styles.relatedArticleContainer,{backgroundColor: '#FF998E'}]}>
                <Text style = {styles.relatedArticleText}>{this.state.article1}</Text>
                </View>
                <View style={[styles.relatedArticleContainer,{backgroundColor: '#FFE356'}]}>
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



const styles = StyleSheet.create({
  textContainer: {
    color: '#7695FF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    color: '#7695FF',
  },
  containerTitle:{
    flex: 1,
    color: '#7695FF',
    textAlign:'center',
    alignItems: 'center',
    paddingTop: mainPadding,
  },
  imageContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel:{
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: mainPadding,
    paddingTop: mainPadding,
    color: '#7695FF',
  },
  contentLabel:{
    paddingLeft: mainPadding,
    paddingRight: mainPadding,
    paddingTop: mainPadding/3,
    includeFontPadding: true,
    color: '#828282',

    },

  relatedArticleContainer:{
    flexDirection: 'row',
    textAlign:'center',
    alignItems: 'center',
    width: width/11*4,
    height: width/11*4,
    margin: 10,
    borderRadius:5,
  },

  relatedArticle:{
    flex:1,
    flexDirection: 'row',
    textAlign:'center',
    alignItems: 'center',
  },

  welcomeContainerContainer: {
    alignItems: 'center',
    textAlign:'center',

  },
  welcomeContainer: {
    alignItems: 'center',
    textAlign:'center',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom:20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex:1,
    width: width/5*4,
  },

  shadowStyle: {
    shadowRadius: 10,
    shadowOpacity: .2,
  },

  responseContainer:{
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor:'#FF998E',
    width: width/3*2,
    margin: 5,
    height: width/7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  questionContainer:{
    alignItems: 'center',
    width: width/3*2,
    paddingBottom: 20,
    paddingTop: 20,

  },

  responseText:{
    color: '#FFFFFF',
    fontSize: 12,
  },

  relatedArticleText:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionText:{
    color: '#FF998E',
    fontWeight: 'bold',
    fontSize: 13,
  },

},);
