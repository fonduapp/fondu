import React, { Component } from 'react';
import Modal from 'react-native-modal';

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

export default class ReferencePopUp extends Component {

constructor(props) {
    super(props);
    this.state = {
      refs: props.refs,

    };
  }
	render() {
    let references = this.state.refs.map((ref,i) =>{
      ref = ref.replace('<Reference>', '');
      ref = ref.replace('</Reference>', '');
      return <Text>{ref}</Text>
    })
    console.log("in child refernces \t\t\t\t" + references);

		return (
      //<View style= {styles.container}>
      <Modal
      style = {styles.modalContainer}
      isVisible = {this.props.showRef}
      onBackdropPress={()=>this.props.hide()}
      onBackButtonPress={() => this.props.hide()}
>
        <View>
          {this.props.refs.length ? (
            <Text style={[styles.problemText,{fontSize: 18, textAlign:'center'}]}>{references}</Text>
          ) : this.props.content}
        </View>
      </Modal>
      //</View>
		);
	}
}

const styles = StyleSheet.create({
  container:{
    width: '60%',
    marginBottom: 30
  },
  modalContainer:{
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: width/16,
    width: width*3/4,
    maxHeight: height*1/2,
    top: height/4,
    left: width*1/8,
    justifyContent:'flex-start',
    marginLeft: 0,
    flex: 0,
  },
  problemText:{
    color: '#7B80FF',
    fontWeight:'bold',
    fontSize: 16,
    lineHeight:20,
    marginBottom:20,

  },
});
