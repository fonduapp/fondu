import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';
import ProgressBar from '../components/ProgressBar';



export default class ProgressNavBar extends Component {

	render() {
		return (
      <View style = {{}}>
        { this.props.title != null ?
            <View style={{flex: 1, padding: 25, position:'absolute', top:0, left: 0, right: 0}}>
              <Text style={[styles.titleText,{color: this.props.color==null ? 'white': this.props.color}]}> {this.props.title} </Text>
            </View>
            : null
        }
        <View style = {{ flexDirection: 'row', padding: 25, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginRight: 20}}>
            <Icon name='arrow-back' color= {this.props.color==null ? 'white': this.props.color} size={40}/>
          </TouchableOpacity>
          
          { this.props.progress != null ?
            <ProgressBar color= {this.props.color==null ? 'white': this.props.color}
                         progress = {this.props.progress}
            />
            : null
          }
        </View>

      </View>

		);
	}
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});