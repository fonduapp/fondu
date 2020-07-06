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
import {textStyle} from '../styles/text.style.js';
import ProgressNavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { Icon, Avatar } from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import host from '../constants/Server.js';
import { _getAuthTokenUserId } from '../constants/Helper.js';
import { shortDayNames } from '../constants/Date.js';

const { width } = Dimensions.get('window');
const mainPadding = 30;

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.focusCheckpointDay = props.navigation.getParam('focusCheckpointDay', false);
    this.streak = props.navigation.getParam('streak', -1);
    this.allAreas = props.navigation.getParam('allAreas', []);
    this.areaLevels = props.navigation.getParam('areaLevels', {});
  }

  state = {
    scrollBarValue: new Animated.Value(0),
    checkpointDayOpacity: new Animated.Value(1),
    accountPairedNotif: true,
    accountPaired:true,
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
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/2,
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

      console.log(exception);
    }


  }

  onPressRelationshipStatus = (selectedIndex) => {
    this.setState({ relationshipStatusSelectedIndex: selectedIndex });
  };

  onPressCheckpointDay = (selectedIndex) => {
    this.setState({ checkpointDaySelectedIndex: selectedIndex });
  };

  onLayoutScrollView = () => {
    if (this.focusCheckpointDay) {
      this.scroll.scrollTo({ x: width*2 });
    }
  };

  blinkCheckpointDay(duration) {
    const { checkpointDayOpacity } = this.state;
    Animated.timing(checkpointDayOpacity, {
      toValue: 0.5,
      duration,
    }).start();
    setTimeout(() => {
      Animated.timing(checkpointDayOpacity, {
        toValue: 1,
        duration,
      }).start();
    }, duration);
  }

  onLayoutCheckpointDay = () => {
    if (this.focusCheckpointDay) {
      const duration = 250;
      this.blinkCheckpointDay(duration);
      setTimeout(() => {
        this.blinkCheckpointDay(duration);
      }, 2*duration);
    }
  };

  render() {
    let { scrollBarValue } = this.state;
    const {
      checkpointDayOpacity,
      relationshipStatusSelectedIndex,
      checkpointDaySelectedIndex,
    } = this.state;
    const line = {
      labels: ['6/12', '6/19', '6/26', '7/2', '7/9', '7/16'],
      datasets: [
        {
          data: [20, 45, 28, 80, 101, 43],
          strokeWidth: 0.01, // optional
        },
      ],
    };

    return (
      <View style = {styles.container}>
        <StatusBar hidden />
        <ProgressNavBar navigation={this.props.navigation} title = {"Profile"}/>
        <View style= {{alignItems: 'center', marginBottom: 20}}>
          <Avatar rounded size={100} icon={{name: 'person'}} />
          <Text style={[textStyle.header4,{color:'white', marginTop: 5}]}>Joe Schmoe</Text>
        </View>
        <View style={styles.containerLabel}>
          <TouchableOpacity style={styles.containerLabelContainer}
                            onPress={() => { this.scroll.scrollTo({ x: 0 }) }}>
            <Text style={styles.textContainer}>Performance</Text>
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
                onLayout={this.onLayoutScrollView}
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

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                {this.state.relationshipStatus != 1 && this.state.accountPaired ?
                  <>
                  <Text style = {[styles.performanceHeaderText,{marginTop: 20}]}>Your Relationship Level</Text>
                  <View style= {{
                    flexDirection:'row', 
                    alignItems:'center',
                  }}>
                  <StatsContainer icon="favorite" 
                                  mainText="lv 2" 
                                  color={theme.PRIMARY_COLOR_3}
                                  textColor='white'/>
                  <ProgressBar progress={0.5} color={theme.PRIMARY_COLOR_3} style={{marginLeft: 15, flex: 1}} label={"5/30"}/>
                  
                  </View>
                  </>
                  :
                  null

                }
                  <Text style = {styles.performanceHeaderText}>Your Statistics</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                    <StatsContainer icon="whatshot" 
                                    mainText={this.streak} 
                                    subText="week streak" 
                                    color={theme.SECONDARY_COLOR}
                                    textColor = {theme.TEXT_COLOR}/>
                    <StatsContainer icon="star" 
                                    mainText="20" 
                                    subText="XP earned" 
                                    color={theme.SECONDARY_COLOR}
                                    style={{marginLeft: 10}}
                                    textColor = {theme.TEXT_COLOR}/>
                  </View>
                  <Text style = {styles.performanceHeaderText}>Your XP Earned</Text>
                  <View style={{alignSelf:"center"}}>
                    <LineChart
                      data={line}
                      width={width}
                      height={180}
                      chartConfig={{
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        color: (opacity = 1) => `rgba(123, 127, 255, ${opacity})`,
                        decimalPlaces: 0,
                        propsForLabels:{fontFamily:'poppins-bold', fontWeight: 'bold', opacity: 0.5},
                        fillShadowGradient:theme.PRIMARY_COLOR,
                        fillShadowGradientOpacity:0.5

                      }}

                      bezier={false}
                      withInnerLines={false}
                      withOuterLines={false}
                      fontFamily={"poppins-bold"}
                      segments={2}
                      fromZero={true}
                      withDots={true}
                    />

                  </View>
                  <Text style = {styles.performanceHeaderText}>Area Level</Text>
                  <View style={{flexDirection:'column', justifyContent:'space-evenly', flex:1 }}>
                    {
                      this.allAreas.map((area, key)=>(
                        <AreaLevelContainer areaName={area.area_name} 
                                            key={key} 
                                            level={this.areaLevels[area.area_id].area_level}
                                            totalExp = {this.areaLevels[area.area_id].total_exp}
                                            areaExp = {this.areaLevels[area.area_id].area_exp}
                        />
                      ))
                    }
                    
                  </View>


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
                  <Animated.View
                    style={styles.accountSection}
                    opacity={checkpointDayOpacity}
                    onLayout={this.onLayoutCheckpointDay}
                  >
                    <Text style={styles.accountHeaderText}>CHECKPOINT DAY</Text>
                    <StyledButtonGroup
                      onPress={this.onPressCheckpointDay}
                      selectedIndex={checkpointDaySelectedIndex}
                      buttons={shortDayNames}
                    />
                  </Animated.View>
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
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'white',
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
    ...textStyle.caption,
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
    opacity: 0.5,
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
  welcomeSubContainer:{
    marginTop: 40,
    width: width,
    alignItems: 'center',
    flex:1,

  },
  scrollContainer:{
    width: width,
    alignItems: 'stretch',
    paddingHorizontal:30 ,
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
  performanceHeaderText:{
    color: theme.TEXT_COLOR,
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 20,
    ...textStyle.subheader,
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
const AreaLevelContainer = ({areaName, level, areaExp, totalExp}) =>{
  let progress = areaExp/totalExp
  let label = areaExp + "/" + totalExp
  return(
    <View style={{flexDirection:'row',marginVertical:10, flex: 1}}>
      <View style={{backgroundColor:theme.PRIMARY_COLOR, borderRadius: 20, width: 75, height: 75}}></View>
      <View style={{justifyContent:'space-evenly', paddingHorizontal: 20, flex: 1, }}>
        <Text style={[{flex:1, color:theme.PRIMARY_COLOR},textStyle.subheader]}>{areaName}</Text>
        <Text style={[{flex:1, color:theme.PRIMARY_COLOR, opacity: 0.5},textStyle.label]}>Level {level}</Text>
        <ProgressBar progress={progress} label={label}/>
      </View>

    </View>
  )
}

const StatsContainer = ({ icon, mainText, subText, color, textColor, style}) => (

    <View style={{
            backgroundColor:color,
            borderRadius: 20, paddingLeft: 15,
            paddingRight: 20,paddingVertical: 12,
            flexDirection:'row',
            alignItems: 'center',
            ...style
          }}
    >
      <Icon name={icon} size={20} color={textColor}/>
      <Text style={ [textStyle.label,{marginLeft: 5, color:textColor}]}>{mainText}</Text>
      <Text style={ [textStyle.caption,{marginLeft: 5, color:textColor,opacity:0.5}]}>{subText}</Text>
    </View>


)

const StyledButtonGroup = ({ onPress, selectedIndex, buttons }) => (
  <View
    style={{
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: theme.SECONDARY_COLOR,
      borderRadius: 20,
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
