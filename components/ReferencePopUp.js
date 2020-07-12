import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {textStyle} from '../styles/text.style.js';
import { renderText, italicize } from '../constants/Helper.js'


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

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;

class ReferencePopUp extends Component {

constructor(props) {
    super(props);
    this.state = {
      refs: props.refs,
    };
    this.italicize = italicize.bind(this);
    this.renderText = renderText.bind(this);
  };
	render() {
    let references = this.props.refs.map((ref,i) =>{
      return<Text style ={{marginBottom:20,paddingBottom:20}}>{this.italicize(ref)}</Text>
    })
		return (
      //<View style= {styles.container}>
      <Modal
      style = {styles.modalContainer}
      isVisible = {this.props.showRef}
      onBackdropPress={()=>this.props.hide()}
      onBackButtonPress={() => this.props.hide()}
>
      <View>
        <Text style={[styles.titleText, {textAlign:'left'}]}>References</Text>
        </View>

        <ScrollView style ={{textAlign:'left'}}>
            <Text style={[styles.refText, {textAlign:'left'}]}>{references}</Text>
        </ScrollView>

      </Modal>
		);
	}
}
export default ReferencePopUp;
const styles = StyleSheet.create({
  container:{
    width: '60%',
    marginBottom: 30
  },
  modalContainer:{
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: width/16,
    width: width*5/6,
    maxHeight: height*1/2,
    top: height/4,
    left: width*1/12,
    //justifyContent:'flex-start',
    textAlign:'left',
    marginLeft: 0,
    flex: 0,
  },
  refText:{
    color: '#7B80FF',
    ...textStyle.paragraph,
    fontSize:12,
    lineHeight:15,
    textAlign:'left',
  },
  titleText:{
    color: '#7B80FF',
    ...textStyle.header,
    paddingTop:15,
    paddingBottom:5,
    lineHeight:15,
    textAlign:'left',
  },
});
