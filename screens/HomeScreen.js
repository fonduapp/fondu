import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
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
import { Icon, Avatar } from 'react-native-elements';
import theme from '../styles/theme.style.js';
import AssessmentScreen from '../screens/AssessmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createStackNavigator } from 'react-navigation-stack';
import CustomIcon from '../components/CustomIcon.js';
import { registerRootComponent, AppLoading } from 'expo';
import ContentModule from '../components/ContentModule';
import WeekBar from '../components/WeekBar';


const { width } = Dimensions.get('window');
const mainPadding = 40;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    scrollBarValue: new Animated.Value(0),
    assessmentNotif: false, // toggle to determine whether assessment is ready
  };

  _moveScrollBar = (event) => {
    Animated.timing(this.state.scrollBarValue, {
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/2,
      duration: 0
    }).start();

  };

  render() {

    var today = new Date();
    let date =   monthNames[today.getMonth()] + " " + today.getDate();


    return (
      <View style={this.state.assessmentNotif ? styles.notificationBar : styles.noNotificationBar}>
            { this.state.assessmentNotif ? 
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Assessment')}>
              <Text style={styles.notificationText}>
                  Take your routine assessment now!
              </Text>
            </TouchableOpacity>
            : null
            }
            <WeekBar/>

            <View style = {{marginLeft: 30, marginBottom: 30}}>
              <Text>Today</Text>
              <Text style = {{fontSize: 30}}>{date}</Text>
              
            </View>



            <View style={styles.welcomeContainer}>
              <Text style = {{marginLeft: 30 }}>Affection and Fun</Text>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={width - 60}
                snapToAlignment={"center"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                >

                <ContentModule title = "Affectionate Touch" onPress={() => this.props.navigation.navigate('Assessment')} />
                <ContentModule title = "Play Behaviors" onPress={() => this.props.navigation.navigate('Assessment')} />
                <ContentModule title = "Affectionate Touch" onPress={() => this.props.navigation.navigate('Assessment')} />



              </ScrollView>
            </View>
          </View>
    );
  }


  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'FondU',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLayoutPreset: 'center',
      headerTitleStyle: {textAlign:"center", 
                         flex:1,
                         color:theme.PRIMARY_COLOR,
                         fontWeight: 'bold'},
      headerLeft: (
                    <TouchableOpacity style={{margin: 25, borderRadius: 50}} 
                                      onPress={()=> navigation.navigate('Profile')}>
                                      <Avatar rounded size = "small" icon={{name: 'person'}}/>
                    </TouchableOpacity>
                  ), 
      headerRight: (<View style={{marginRight: 25, flexDirection: 'row'}}>
                      <CustomIcon name='streak-fire' size={27} color={theme.PRIMARY_COLOR_6}/>
                      <Text style={{marginLeft:5, fontWeight: 'bold', color:theme.PRIMARY_COLOR, alignSelf:'center'}}>1</Text>
                      <Text style={{marginLeft:7, fontWeight: 'bold', color:theme.PRIMARY_COLOR, alignSelf:'center'}}>lv 1</Text>
                    </View>)
    }
  };

}




const AppNavigator = createStackNavigator({
  Home:  HomeScreen,
  Assessment: AssessmentScreen,
  Profile: ProfileScreen,
});

const styles = StyleSheet.create({
  notificationBar:{
    backgroundColor: theme.PRIMARY_COLOR_4,
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  noNotificationBar:{
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  notificationText:{
    padding: mainPadding,
    color: theme.TERTIARY_COLOR,
    fontWeight: 'bold',
    textAlign:'center',
  },
  textContainer: {
    color: theme.PRIMARY_COLOR,
  },
  container: {
    flex: 1,
    
  },
  contentContainer: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,

    
  },
  welcomeContainer: {
    marginTop: 10,
    flex:1,
    width: width,
  },
  welcomeSubContainer:{
    width: width - 80,
    height: width- 80,
    alignItems: 'center',
    backgroundColor: theme.SECONDARY_COLOR,
    margin: 15,
    borderRadius: 40,

  },
  mainHeaderText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.TERTIARY_COLOR,
  },
  mainParagraphText:{
    fontSize: 15,
    color: theme.TERTIARY_COLOR,
  },
  mainImageContainer:{
    width: width/3,
    height:width/3,
    backgroundColor: '#F2F2F2',
    margin: 30,
  },

});
