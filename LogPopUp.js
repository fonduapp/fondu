import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  Alert,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const mainPadding = 30;

export default class ProbReport extends React.Component{
  render(){
  return (
    <Modal
    style = {styles.modalContainer}
    isVisible = {this.props.isVisible}
    onBackdropPress={()=>this.props.hide()}>
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
  )};
}

const styles = StyleSheet.create({

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
});
