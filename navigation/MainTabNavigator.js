import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import SubtopicScreen from '../screens/SubtopicScreen';
import ArticleScreen from '../screens/ArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CalenderScreen from '../screens/CalenderScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
  headerLayoutPreset: 'center',

});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Assessment: {
      screen: AssessmentScreen,
      navigationOptions: {
        header: null,
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  config
);


HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible: tabBarVisible,
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-home${focused ? '' : '-outline'}`
            : 'md-home'
        }
      />
    ),
  };
};


HomeStack.path = '';

const ResourcesStack = createStackNavigator(
  {
    Resources: ResourcesScreen,
    Subtopics: SubtopicScreen,
    Article: ArticleScreen,

  },
  config
);


ResourcesStack.navigationOptions = ({navigation}) => {
  return{
    tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'} />
    ),
    headerLeft:{}
 }
}


ResourcesStack.path = '';

const CalendarStack = createStackNavigator(
  {
    Calendar: CalenderScreen,
  },
  config
);

CalendarStack.navigationOptions = {
  tabBarLabel: 'Calendar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
  ),
};

CalendarStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ResourcesStack,
  HomeStack,
  CalendarStack},
  {
     initialRouteName: 'HomeStack',
     tabBarOptions: { showLabel: false,
                      indicatorStyle: {
                        width: 0, height: 0, elevation: 0,      
                      },
                      style: {elevation: 20,             
                              shadowOffset: { width: 0, height: 0},
                              borderTopWidth: 0
                    }},
  }
);

tabNavigator.path = '';

export default tabNavigator;
