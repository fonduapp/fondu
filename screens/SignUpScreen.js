import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text>sign up</Text>
    </View>
  );
}

SignUpScreen.navigationOptions = {
  title: 'Resources',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});