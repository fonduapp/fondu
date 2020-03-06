import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from '../screens/LandingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';


const AuthStack = createStackNavigator(
  {
    // Splash: SplashScreen,
    Landing: LandingScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
  }
);

AuthStack.path = '';

export default AuthStack;
