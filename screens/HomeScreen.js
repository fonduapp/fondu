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

const { width } = Dimensions.get('window');
const mainPadding = 40;

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
    let { scrollBarValue } = this.state;
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
            <View style={styles.containerLabel}>
              <TouchableOpacity style={styles.containerLabelContainer}
                                onPress={() => { this.scroll.scrollTo({ x: 0 }) }}>
                <Text style={styles.textContainer}>Focus</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.containerLabelContainer}
                                onPress={() => { this.scroll.scrollTo({ x: width }) }}>
                <Text style={styles.textContainer}>Strength</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.welcomeContainer}>
              <Animated.View style={[styles.containerLabel, 
                {transform: [
                  {
                    translateX: scrollBarValue
                  }
                ]}
                ]}>
                <View style={styles.containerLabelScrollContainer}>
                </View>
                <View style={styles.containerLabelScrollContainerNoBorder}>
                </View>
              </Animated.View>

              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={width}
                snapToAlignment={"center"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={this._moveScrollBar}
                ref={(node) => this.scroll = node}
                >

                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainHeaderText}>Some behavior here</Text>
                  <Text style={styles.mainParagraphText}>The definition of the behavior here</Text>

                  <View style={styles.recommendedSectionsContainer}>
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR_2}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR_3}]} />
                  </View>
                </View>

                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainHeaderText}>Some other behavior here</Text>
                  <Text style={styles.mainParagraphText}>The definition of the behavior here</Text>

                  <View style={styles.recommendedSectionsContainer}>
                    <View style={[styles.recommendedSection,{backgroundColor: 'powderblue'}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: 'skyblue'}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: 'steelblue'}]} />
                  </View>
                </View>

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
        margin: 10,
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
      headerRight: (<View style={{padding: 30}}><Icon name='whatshot' /></View>)
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
    color: '#7695FF',
  },
  containerLabel:{
    flexDirection: 'row',
    textAlign:'center',
    alignItems: 'center',
    paddingLeft: mainPadding,
    paddingRight: mainPadding,
  },
  containerLabelContainer:{
    flex:1,
    textAlign:'center',
    alignItems: 'center',
  },
  containerLabelScrollContainer:{
    flex:1,
    borderWidth: 1,
    borderColor: theme.PRIMARY_COLOR,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
  },
  containerLabelScrollContainerNoBorder:{
    flex:1,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: theme.SECONDARY_COLOR,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex:1,
    width: width,
  },
  welcomeSubContainer:{
    width: width,
    alignItems: 'center',
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
  recommendedSectionsContainer:{
    flex: 1, 
    flexDirection: 'row',
    marginTop:30,
  },
  recommendedSection:{
    width: 100, 
    height: 100,
    margin: 5,
    borderRadius:5,
  }

});
