import { StyleSheet } from 'react-native';

const shadowStyle = StyleSheet.create({
  primaryShadowStyle: {
     elevation: 5,
     shadowColor: '#000',
     shadowOpacity: 0.2,
     shadowRadius: 2,
     shadowOffset: {width: 0, height: 5},
  },
})

export {shadowStyle}