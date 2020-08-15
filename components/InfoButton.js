import  React,{Component} from 'react';
import { Text, Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import ReferencePopUp from '../components/ReferencePopUp';
import {textStyle} from '../styles/text.style.js';
import {Icon} from 'react-native-elements';
import { createISC, renderText} from '../utils/Helper.js'



const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
export default class InfoButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      showRef:false,
      screen: 'closed',
      color:'#94ADFF',
    };
    this.createISC = createISC.bind(this);
    this.renderText = renderText.bind(this);
  }

  close(){
    this.setState({
        color:'#94ADFF',
        screen:'closed',
    });
  }
  hideReferences = () => {
    this.setState({showRef:false});
  }

  open(){
    this.setState({
            color:'#9394FF',
            screen:'open',
        });
  }

  screens=(research)=>{
    switch(this.state.screen){
        case "closed":
            return(
        <TouchableOpacity
        style={[styles.directionContainer, {backgroundColor:this.state.color, flexDirection:'row'}]}
        onPress = {() => this.open()}>
          <Icon
            name={this.props.iconName}
            type={this.props.iconType}
            color='#FFFFFF'
            containerStyle= {styles.iconContainer}
            size={30}>
            </Icon>
            <View style={styles.innerDirectionContainer}>
            <Text style={styles.suggestionText}>
              {this.props.label}
            </Text>
            </View>
          </TouchableOpacity>
            );
        case "open":
          return (
        <TouchableOpacity
          style={[styles.directionContainer, {backgroundColor:this.state.color}]}
          onPress = {() => this.close()}>
          <TouchableOpacity style={{ flexDirection:'row'}}
          onPress = {() => this.close()}>
            <Icon
              name={this.props.iconName}
              type={this.props.iconType}
              color='#FFFFFF'
              containerStyle= {styles.iconContainer}
              size={30}>
            </Icon>
            <View style={styles.innerDirectionContainer}>
            <Text style={styles.suggestionText}>
              {this.props.label}
            </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.dropDownText}>
            {research[0]}
          </Text>
          </TouchableOpacity>
          );
        }
      }

  render(){
    let research = this.createISC(this.props.research, '<Research>', '</Research>');
    var buttons = this.screens(research);
  return (
    <View>
      {buttons}
    <ReferencePopUp
      showRef = {this.state.showRef}
      refs = {this.props.reference}
      hide ={this.hideReferences}
      />
      </View>

  );
}
}

const styles = StyleSheet.create({

  directionContainer:{
    borderRadius:15,
    padding:20,
    paddingLeft:5,
    marginBottom:15,
    marginLeft:width*1/12,
    marginRight:width*1/15,
    width:width*4/5,
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: '#475279',
    shadowOpacity: .5,
    alignItems:'center',
  },
  innerDirectionContainer:{
    width:width*3/5,
  },
  iconContainer:{
    marginRight:10,
    marginLeft:10
  },
  suggestionText:{
    color: '#FFFFFF',
    flex:5,
    ...textStyle.subheader2,
  },
  dropDownText:{
    color: '#FFFFFF',
    ...textStyle.paragraph,
    marginRight:width*.05,
    marginLeft:width*2/15,
    marginTop:width*.05,

  },
});
