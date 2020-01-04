import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';
import ProgressBar from '../components/ProgressBar';



export default class ProgressNavBar extends Component {

	render() {
		return (
      <View style = {{ flexDirection: 'row', padding: 25, alignItems: 'center',}}>
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
		);
	}
}

const styles = StyleSheet.create({
});