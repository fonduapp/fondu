import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class SignInScreen extends Component{
  constructor(props){
    super(props);
  }
  render(){
  return (
    <View style={styles.container}>
      <Text>sign in</Text>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}><Text>Sign in</Text></TouchableOpacity>
    </View>
  );
  }
}

SignInScreen.navigationOptions = {
  title: 'Resources',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});