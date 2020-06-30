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
  StatusBar,
  AsyncStorage
} from 'react-native';
import theme from '../styles/theme.style.js';
import ProgressNavBar from '../components/NavBar';
import ProgressRing from '../components/ProgressRing';
import { Icon, Avatar } from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import host from '../constants/Server.js';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import { shortDayNames } from '../constants/Date.js';

const { width } = Dimensions.get('window');
const mainPadding = 30;

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    scrollBarValue: new Animated.Value(0),
    accountPairedNotif: true,
    relationshipStatusSelectedIndex: -1,
    checkpointDaySelectedIndex: -1,
  };

  componentDidMount() {
    this.fetchRelationshipStatus();
    this.fetchAssessDay();
  }

  componentWillUnmount() {
    this.updateInfo();
  }

  getRelationshipStatus() {
    const { relationshipStatusSelectedIndex } = this.state;
    switch (relationshipStatusSelectedIndex) {
      case 0: return 1;
      case 1: return 2;
      case 2: return 3;
      default: return -1;
    }
  }

  relationshipStatusToIndex(relationshipStatus) {
    switch (relationshipStatus) {
      case 1: return 0;
      case 2: return 1;
      case 3: return 2;
      default: return -1;
    }
  }

  getCheckpointDay() {
    const { checkpointDaySelectedIndex } = this.state;
    return checkpointDaySelectedIndex;
  }

  fetchRelationshipStatus() {
    this.fetchRequest('relationshipStatus')
    .then((responseJson) => {
      const {
        relationship_status: relationshipStatus,
      } = responseJson;
      this.setState({
        relationshipStatusSelectedIndex: this.relationshipStatusToIndex(relationshipStatus),
      })
    });
  }

  fetchAssessDay() {
    this.fetchRequest('nextAssessDate')
    .then((responseJson) => {
      const {
        next_assess_date: assessDate,
      } = responseJson;
      if (assessDate !== null) {
        this.setState({
          checkpointDaySelectedIndex: new Date(assessDate).getDay(),
        });
      }
    });
  }

  async fetchRequest(request) {
    const {
      authToken,
      userId,
    } = await _getAuthTokenUserId();
    const path = `http://${host}:3000/${request}/${userId}/${authToken}`;
    return fetch(path, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .catch(console.error);
  }

  async updateInfo() {
    const relationshipStatus = this.getRelationshipStatus();
    const checkpointDay = this.getCheckpointDay();

    const authTokenUserId = await _getAuthTokenUserId();
    let promises = [];

    if (relationshipStatus >= 0) {
      promises.push(
        this.updateRequest('updateRelationshipStatus', {
          ...authTokenUserId,
          relationshipStatus,
        })
      );
    }

    if (checkpointDay >= 0) {
      promises.push(
        this.updateRequest('setAssessDay', {
          ...authTokenUserId,
          assessDay: checkpointDay,
        })
      );
    }

    await Promise.all(promises);
  }

  updateRequest(request, data) {
    return fetch(`http://${host}:3000/${request}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .catch(console.error);
  }

  _moveScrollBar = (event) => {
    Animated.timing(this.state.scrollBarValue, {
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/3,
      duration: 0
    }).start();

  };

  _signOut = async () => {

    //clear authToken and userId
    try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');


        this.props.navigation.navigate('Auth')


    }
    catch(exception) {

      console.log("furk " + exception);
    }


  }

  onPressRelationshipStatus = (selectedIndex) => {
    this.setState({ relationshipStatusSelectedIndex: selectedIndex });
  };

  onPressCheckpointDay = (selectedIndex) => {
    this.setState({ checkpointDaySelectedIndex: selectedIndex });
  };

  render() {
    let { scrollBarValue } = this.state;
    const {
      relationshipStatusSelectedIndex,
      checkpointDaySelectedIndex,
    } = this.state;
    const line = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43],
          strokeWidth: 2, // optional
        },
      ],
    };

    const data = {
      data: [0.4, ]
    };

    return (
      <View style = {styles.container}>
        <StatusBar hidden />
        <ProgressNavBar navigation={this.props.navigation} title = {"Profile"}/>
        <View style= {{alignItems: 'center', marginBottom: 30}}>
          <Avatar rounded size="xlarge" icon={{name: 'person'}} />
        </View>
        <View style={styles.containerLabel}>
          <TouchableOpacity style={styles.containerLabelContainer}
                            onPress={() => { this.scroll.scrollTo({ x: 0 }) }}>
            <Text style={styles.textContainer}>Performance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.containerLabelContainer}
                            onPress={() => { this.scroll.scrollTo({ x: width }) }}>
            <Text style={styles.textContainer}>Relationship</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.containerLabelContainer}
                            onPress={() => { this.scroll.scrollTo({ x: width*2 }) }}>
            <Text style={styles.textContainer}>Account</Text>
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
                style={{flex:1}}
                contentContainerStyle={styles.contentContainer}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={width}
                snapToAlignment={"center"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={this._moveScrollBar}
                ref={(node) => this.scroll = node}>

                <ScrollView contentContainerstyle={styles.scrollContainer}>
                  <Text style = {[styles.accountHeaderText,{ alignSelf: "flex-start", marginLeft: 30, marginTop: 0}]}>OVERALL RELATIONSHIP HEALTH</Text>
                  <View style={{alignSelf:"center"}}>
                    <LineChart
                      data={line}
                      width={width} // from react-native
                      height={220}
                      yAxisSuffix={'%'}
                      chartConfig={{
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        color: (opacity = 1) => `rgba(123, 127, 255, ${opacity})`,
                        decimalPlaces: 0,
                      }}
                      bezier
                    />

                    <Text style = {[styles.accountHeaderText,{ alignSelf: "flex-start", marginLeft: 30, marginTop: 40}]}>TOPIC HEALTH</Text>

                    <View style = {{paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: 'space-evenly', marginTop:20, marginBottom:5}}>
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 50 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 70 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 25 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 90 }
                        />
                    </View>
                    <View style = {{paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: 'space-evenly', marginBottom:40}}>
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 80 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 30 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 40 }
                        />
                        <ProgressRing
                          radius={ 35 }
                          stroke={ 5 }
                          progress={ 90 }
                        />
                    </View>
                  </View>


                </ScrollView>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {
                    this.state.accountPairedNotif ?
                    <View style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}>
                      <Text style={styles.relationshipText}>Pair your account now!</Text>
                      <TouchableOpacity style={{position:'absolute', left:0, top: 0, margin: 10}}
                            onPress={() => this.setState({ accountPairedNotif:false })}>
                        <Icon name = 'close' color='white'/>
                      </TouchableOpacity>
                    </View>
                    : null
                  }
                  <View style={styles.accountSection}>
                    <Text style={styles.accountHeaderText}>RELATIONSHIP STATUS</Text>
                    <StyledButtonGroup
                      onPress={this.onPressRelationshipStatus}
                      selectedIndex={relationshipStatusSelectedIndex}
                      buttons={['Single', 'Relationship', 'Other']}
                    />
                  </View>
                  <View style={styles.accountSection}>
                    <Text style={styles.accountHeaderText}>CHECKPOINT DAY</Text>
                    <StyledButtonGroup
                      onPress={this.onPressCheckpointDay}
                      selectedIndex={checkpointDaySelectedIndex}
                      buttons={shortDayNames}
                    />
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
                  <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}
                                    onPress = {this._signOut}>
                      <Text style={styles.relationshipText}>Sign out</Text>
                  </TouchableOpacity>
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
  contentContainer:{
    paddingTop: 40,
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
  scrollContainer:{
    width: width,
    alignItems: 'stretch',
    paddingLeft: 30,
    paddingRight: 30,

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
    fontWeight: 'bold',
    fontSize: 11,
  },
  accountText:{
    color: theme.PRIMARY_COLOR,
    fontWeight: 'normal',
    fontSize: 18,
  },
  accountSection:{
    marginBottom: 10,
  }

});

const StyledButtonGroup = ({ onPress, selectedIndex, buttons }) => (
  <View
    style={{
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: theme.SECONDARY_COLOR,
      borderRadius: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      width: '100%',
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginVertical: 5,
    }}
  >
    {buttons.map((button, i) => (
      <View
        key={i}
        style={{
          flex: 1,
          height: 40,
          alignItems: 'center',
          borderColor: i === selectedIndex || i === selectedIndex - 1
            ? 'transparent'
            : theme.TRANSLUCENT_GRAY,
          borderRightWidth: i === buttons.length - 1 ? 0 : 1,
        }}
      >
        <TouchableOpacity
          onPress={() => onPress(i)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: 'transparent',
            ...(selectedIndex === i ? {
              backgroundColor: 'white',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
            } : []),
            width: '110%',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: theme.TEXT_COLOR_2,
              fontFamily: 'poppins-bold',
              opacity: selectedIndex < 0 || selectedIndex === i ? 1.0 : 0.5,
            }}
          >
            {button}
          </Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
);
