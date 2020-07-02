import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {textStyle} from '../styles/text.style.js';

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
  }
  // componentDidMount(){
  //   console.log('mounting')
  //   console.log(this.props.refs)
  //     this.setState({
  //       refs:this.props.refs
  //     });

  }
	render() {
    let references = this.props.refs.map((ref,i) =>{
      return<Text>{ref}</Text>
    })
    console.log('in child')
    //console.log(references)
		return (
      //<View style= {styles.container}>
      <Modal
      style = {styles.modalContainer}
      isVisible = {this.props.showRef}
      onBackdropPress={()=>this.props.hide()}
      onBackButtonPress={() => this.props.hide()}
>
        <ScrollView style ={{textAlign:'left'}}>
            <Text style={[styles.problemText,{fontSize: 18, textAlign:'left'}]}>{references}</Text>
        </ScrollView>
      </Modal>
      //</View>
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
    left: width*1/8,
    //justifyContent:'flex-start',
    textAlign:'left',
    marginLeft: 0,
    flex: 0,
  },
  problemText:{
    color: '#7B80FF',
    ...textStyle.paragraph,
    lineHeight:20,
    textAlign:'left',
    marginBottom:20,

  },
});
