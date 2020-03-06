import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LandingScreen extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={styles.container}>
        <Text>fondu</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}><Text>Sign in</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}><Text>Sign up</Text></TouchableOpacity>
      </View>
    );
  }
}

LandingScreen.navigationOptions = {
  title: 'Resources',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
