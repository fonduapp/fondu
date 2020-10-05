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
  AsyncStorage,
  TextInput,
} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';
import ProgressNavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { Icon, Avatar } from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import { shortDayNames } from '../constants/Date.js';
import fetch, { _getAuthTokenUserId } from '../utils/Fetch';
import Color from 'color';
import Switch from '../components/Switch';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const mainPadding = 30;
// height of avatar container
const avatarHeight = 180;

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    const { getParam } = props.navigation;
    this.focusCheckpointDay = getParam('focusCheckpointDay', false);
    this.streak = getParam('streak', -1);
    this.allAreas = getParam('allAreas', []);
    this.areaLevels = getParam('areaLevels', {});
    this.totalExp = getParam('totalExp', 0);
    this.progressionExps = [];
    this.progressionDates = [];
    getParam('expProgression', []).forEach(({ exp, date: dateString }) => {
      this.progressionExps.push(exp);
      const date = new Date(dateString);
      const dateFormatted = `${1 + date.getMonth()}/${date.getDate()}`;
      // TODO: replace with dateFormatted
      this.progressionDates.push(dateString);
    });

    this.name = getParam('name', '');
    this.email = getParam('email', '');

    this.state = {
    scrollBarValue: new Animated.Value(0),
    checkpointDayOpacity: new Animated.Value(1),
    accountPaired: getParam('paired', false),
    relationshipStatusSelectedIndex: -1,
    checkpointDaySelectedIndex: -1, 
      learningReminder: false,
      checkupReminder: false,
      leftScrollY: new Animated.Value(0),
      rightScrollY: new Animated.Value(0),
    };

    this.updateRelationshipInfo();
  }

  

  componentDidMount() {
    this.fetchRelationshipStatus();
    this.fetchAssessDay();
  }

  componentWillUnmount() {
    this.updateInfo();
  }

  async updateRelationshipInfo() {
    const { relationshipInfo } = this.props.navigation.state.params;
    if (this.state.accountPaired && relationshipInfo) {
      const {
        relationship_level,
        relationship_exp,
        person1_id,
        person2_id,
      } = relationshipInfo;
      this.relationshipLevel = relationship_level;
      this.relationshipExp = relationship_exp;
      const { userId } = await _getAuthTokenUserId();
      this.partnerId = person1_id !== userId ? person1_id : person2_id;
    }
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

  fetchRequest(request) {
    return fetch('GET', request)
      .catch(console.error);
  }

  async updateInfo() {
    const relationshipStatus = this.getRelationshipStatus();
    const checkpointDay = this.getCheckpointDay();

    let promises = [];

    if (relationshipStatus >= 0) {
      promises.push(
        this.updateRequest('updateRelationshipStatus', { relationshipStatus })
      );
    }

    if (checkpointDay >= 0) {
      promises.push(
        this.updateRequest('setAssessDay', { assessDay: checkpointDay })
      );
    }

    await Promise.all(promises);
  }

  updateRequest(request, params) {
    return fetch('POST', request, params)
      .catch(console.error);
  }

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
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(checkpointDayOpacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
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
      leftScrollY,
      rightScrollY,
    } = this.state;
    const line = {
      labels: this.progressionDates,
      datasets: [
        {
          data: this.progressionExps,
          strokeWidth: 0.01, // optional
        },
      ],
    };

    // TODO: replace with actual value
    const totalRelationshipExp = 100;

    const slidingHeaderTranslate = Animated.add(
      Animated.multiply(
        scrollBarValue.interpolate({
          inputRange: [0, width],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
        leftScrollY.interpolate({
          inputRange: [0, avatarHeight],
          outputRange: [0, -avatarHeight],
          extrapolate: 'clamp',
        }),
      ),
      Animated.multiply(
        scrollBarValue.interpolate({
          inputRange: [0, width],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        rightScrollY.interpolate({
          inputRange: [0, avatarHeight],
          outputRange: [0, -avatarHeight],
          extrapolate: 'clamp',
        }),
      ),
    );

    const scrollIndicatorTranslate = scrollBarValue.interpolate({
      inputRange: [0, width],
      outputRange: [0, width / 2 - mainPadding],
    });

    return (
      <View style = {styles.container}>
        <StatusBar hidden />
        <View style={styles.navBarWrapper}>
          <LinearGradient
            colors={[theme.PRIMARY_COLOR, Color(theme.PRIMARY_COLOR).alpha(0).string()]}
            locations={[0.65, 1]}
          >
            <ProgressNavBar navigation={this.props.navigation} title = {"Profile"}/>
          </LinearGradient>
        </View>
        <View style={styles.mainScrollWrapper}>
          <Animated.View style={[
            styles.slidingHeader,
            { transform: [{ translateY: slidingHeaderTranslate }] },
          ]}>
            <View style= {styles.avatarContainer}>
              <Avatar rounded size={100} icon={{name: 'person'}} />
              <Text style={[textStyle.header4,{color:'white', marginTop: 5}]}>{this.name}</Text>
            </View>
            <View style={styles.stickyHeader}>
              <View style={[styles.containerLabel, styles.stickyHeaderLabelsContainer]}>
                <TouchableOpacity style={styles.containerLabelContainer}
                                  onPress={() => { this.scroll.scrollTo({ x: 0 }) }}>
                  <Text style={styles.textContainer}>Performance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerLabelContainer}
                                  onPress={() => { this.scroll.scrollTo({ x: width*2 }) }}>
                  <Text style={styles.textContainer}>Account</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.stickyHeaderScrollContainer}>
                <Animated.View style={[styles.containerLabel, 
                    {transform: [
                      {
                        translateX: scrollIndicatorTranslate
                      }
                    ]}
                    ]}>
                    <View style={styles.containerLabelScrollContainer}>
                    </View>
                    <View style={styles.containerLabelScrollContainerNoBorder}>
                    </View>
                </Animated.View>
              </View>
            </View>
          </Animated.View>
          <View style={styles.welcomeContainer}>
            <Animated.ScrollView
                  onLayout={this.onLayoutScrollView}
                  style={{flex:1}}
                  contentContainerStyle={styles.contentContainer}
                  horizontal= {true}
                  decelerationRate={0}
                  snapToInterval={width}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollBarValue } } }],
                    {  useNativeDriver: true },
                  )}
                  ref={(node) => this.scroll = node}>

                  <Animated.ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: leftScrollY } } }],
                      { useNativeDriver: true },
                    )}
                    snapToOffsets={[avatarHeight]}
                    snapToEnd={false}
                    showsVerticalScrollIndicator={false}
                  >
                  {this.getRelationshipStatus() !== 1 && this.state.accountPaired ?
                    <>
                    <Text style = {[styles.performanceHeaderText,{marginTop: 20}]}>Your Relationship Level</Text>
                    <View style= {{
                      flexDirection:'row', 
                      alignItems:'center',
                    }}>
                    <StatsContainer icon="favorite" 
                                    mainText={`lv ${this.relationshipLevel}`}
                                    color={theme.PRIMARY_COLOR_3}
                                    textColor='white'/>
                    <ProgressBar
                      progress={Math.min(1,
                        this.relationshipExp/totalRelationshipExp)}
                      color={theme.PRIMARY_COLOR_3}
                      style={{marginLeft: 15, flex: 1}}
                      label={`${this.relationshipExp}/${totalRelationshipExp}`}/>
                    
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
                                      mainText={this.totalExp}
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
                          propsForLabels:{fontWeight: 'bold', opacity: 0.5},
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

                  </Animated.ScrollView>

                  <Animated.ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: rightScrollY } } }],
                      { useNativeDriver: true },
                    )}
                    snapToOffsets={[avatarHeight]}
                    snapToEnd={false}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.accountSection}>
                      <Text style={styles.accountHeaderText}>EMAIL</Text>
                      <View style={styles.emailContainer}>
                        <Text style={styles.email}>
                          {this.email}
                        </Text>
                      </View>
                    </View>
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
                      <TextInput
                        style={styles.partnerInput}
                        placeholder="Link your partner through email"
                        placeholderTextColor={Color(theme.TEXT_COLOR_2).alpha(0.5).string()}
                        selectionColor={theme.PRIMARY_COLOR}
                      />
                    </View>
                    <View style={styles.accountSection}>
                      <Text style={styles.accountHeaderText}>NOTIFICATION</Text>
                      <View style={styles.notificationContainer}>
                        <View style={styles.notificationRow}>
                          <Text style={styles.notificationText}>Learning Reminder</Text>
                          <Switch
                            onValueChange={(val) => this.setState({ learningReminder: val })}
                            value={this.state.learningReminder}
                          />
                        </View>
                        <View style={styles.notificationRow}>
                          <Text style={styles.notificationText}>Checkup Reminder</Text>
                          <Switch
                            onValueChange={(val) => this.setState({ checkupReminder: val })}
                            value={this.state.checkupReminder}
                          />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}
                                      onPress = {this._signOut}>
                        <Text style={styles.relationshipText}>Sign out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.relationshipButton,{ backgroundColor: theme.PRIMARY_COLOR_7}]}
                                      onPress = {null}>
                        <Text style={styles.relationshipText}>Report a Problem</Text>
                    </TouchableOpacity>
                  </Animated.ScrollView>

                </Animated.ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.PRIMARY_COLOR,
  },
  navBarWrapper: {
    width: '100%',
    // float above sliding header
    zIndex: 2,
  },
  mainScrollWrapper: {
    flex: 1,
  },
  slidingHeader: {
    position: 'absolute',
    width: '100%',
    // float above scrollViews
    zIndex: 1,
    backgroundColor: theme.PRIMARY_COLOR,
  },
  avatarContainer: {
    alignItems: 'center',
    height: avatarHeight,
  },
  contentContainer:{
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
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
  stickyHeaderLabelsContainer: {
    paddingBottom: 10,
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
  stickyHeaderScrollContainer: {
    backgroundColor: 'white',
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
    // The sliding header floats on top of the scrollViews, so we need to add
    // padding to push the content into the visible area below the header.
    paddingTop: 230,
  },
  relationshipButton:{
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
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
  },
  emailContainer: {
    backgroundColor: theme.SECONDARY_COLOR,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 20,
    marginVertical: 5,
  },
  email: {
    fontSize: 14,
    color: theme.TEXT_COLOR_2,
    fontFamily: 'poppins-bold',
  },
  partnerInput: {
    height: 50,
    borderRadius: 20,
    paddingLeft: 20,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: Color(theme.TEXT_COLOR_2).alpha(0.5).string(),
    fontSize: 14,
    color: theme.TEXT_COLOR_2,
    fontFamily: 'poppins-bold',
  },
  notificationContainer: {
    marginVertical: 5,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 41,
    alignItems: 'center',
    marginVertical: 3,
  },
  notificationText: {
    fontSize: 14,
    color: theme.TEXT_COLOR_2,
    fontFamily: 'poppins-bold',
  },
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
