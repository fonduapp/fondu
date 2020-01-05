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
  StatusBar
} from 'react-native';
import theme from '../styles/theme.style.js';
import ProgressNavBar from '../components/NavBar';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');
const mainPadding = 30;

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    scrollBarValue: new Animated.Value(0),
    assessmentNotif: false, // toggle to determine whether assessment is ready
  };

  _moveScrollBar = (event) => {
    Animated.timing(this.state.scrollBarValue, {
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/3,
      duration: 0
    }).start();

  };

  render() {
    let { scrollBarValue } = this.state;
    return (
      <View style = {styles.container}>
        <StatusBar hidden />
        <ProgressNavBar navigation={this.props.navigation} title = {"Profile"}/>
        <View style= {{alignItems: 'center'}}>
          <View style={styles.mainImageContainer}>
          </View>
        </View>
        <View style={styles.containerLabel}>
          <View style={styles.containerLabelContainer}>
            <Text style={styles.textContainer}>Performance</Text>
          </View>
          <View style={styles.containerLabelContainer}>
            <Text style={styles.textContainer}>Relationship</Text>
          </View>
          <View style={styles.containerLabelContainer}>
            <Text style={styles.textContainer}>Account</Text>
          </View>
          
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
                style={{flex:1}}
                contentContainerStyle={styles.contentContainer}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={width}
                snapToAlignment={"center"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={this._moveScrollBar}>

                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainHeaderText}>Performance</Text>

                </View>

                <ScrollView contentContainerStyle={styles.relationshipContainer}>
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}
                                    onPress={()=> this.props.navigation.navigate('Assessment')}>
                    <Text style={styles.relationshipText}>What is my Love Language?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_5}]}>
                    <Text style={styles.relationshipText}>What is my Attachment Type?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_2}]}>
                    <Text style={styles.relationshipText}>What is my XXXX?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_2}]}>
                    <Text style={styles.relationshipText}>What is my XXXX?</Text>
                  </TouchableOpacity>
                </ScrollView>

                <ScrollView contentContainerStyle={styles.relationshipContainer}>
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}>
                    <Text style={styles.relationshipText}>Pair your account now!</Text>
                  </TouchableOpacity>
                  <View style={styles.accountSection}>
                    <Text style={styles.accountHeaderText}>RELATIONSHIP STATUS</Text>
                    <View>
                      <Text style={styles.accountText}>Dating</Text>
                      <View style={[styles.accountText, { position: 'absolute', right: 0}]}>
                        <Icon name = 'edit' color={theme.PRIMARY_COLOR}></Icon>
                      </View>
                    </View>
                  </View>
                  <View style={styles.accountSection}>
                    <Text style={styles.accountHeaderText}>PARTNER</Text>
                    <View>
                      <Text style={styles.accountText}>n/a</Text>
                      <View style={[styles.accountText, { position: 'absolute', right: 0}]}>
                        <Icon name = 'edit' color={theme.PRIMARY_COLOR}></Icon>
                      </View>
                    </View>
                  </View>
                  <View style={styles.accountSection}>
                    <Text style={styles.accountHeaderText}>TIME INTERVAL</Text>
                    <View>
                      <Text style={styles.accountText}>1 week</Text>
                      <View style={[styles.accountText, { position: 'absolute', right: 0}]}>
                        <Icon name = 'edit' color={theme.PRIMARY_COLOR}></Icon>
                      </View>
                    </View>
                  </View>
                </ScrollView>

              </ScrollView>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:theme.PRIMARY_COLOR,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex:1,

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
  textContainer: {
    color: 'white',
    fontSize:13,
  },
  mainImageContainer:{
    width: 150,
    height:150,
    backgroundColor: '#F2F2F2',
    marginBottom: 30,
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
    flex:2,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
  },
  welcomeSubContainer:{
    marginTop: 40,
    width: width,
    alignItems: 'center',
    flex:1,

  },
  relationshipContainer:{
    marginTop: 0,
    width: width,
    alignItems: 'stretch',
    padding: 30,

  },
  relationshipButton:{
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    paddingTop: 50,
    paddingBottom: 50,
  },
  relationshipText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17, 
  },
  accountHeaderText:{
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 13,
  },
  accountText:{
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 18,
  },
  accountSection:{
    marginBottom: 10,
  }

});