import React, { Component, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AssessmentQuestions  from '../components/AssessmentQuestions';
import theme from '../styles/theme.style.js';
import { Button, Icon } from 'react-native-elements';
import NextButton from '../components/NextButton';
import ProgressNavBar from '../components/NavBar';
import {textStyle} from '../styles/text.style.js';
import ResultsPage from '../components/ResultsPage.js';
import SetCheckpointDayPage from '../components/SetCheckpointDayPage';
import { longDayNames } from '../constants/Date';
import fetch from '../utils/Fetch';

const { width } = Dimensions.get('window');

export default class AssessmentScreen extends Component{
    constructor(props){
    super(props)
    const { navigation } = props;
    // initial, routine, review, relationship, none
    const assessmentType = navigation.getParam('assessmentType','none');
    this.behaviors = navigation.getParam('behaviors', []);
    this.state = {
      screen: assessmentType === 'initial' ? 'start' : 'quiz', // start, quiz, finish, tutorial
      quizFinish : false,
      score: 0,
      progress:0,
      assessmentType,
      questionDone:false,
      questionRight: false,
      recArea:'nothing',
      areaId: -1,
      behaviorId : navigation.getParam('behaviorId','none'),
      recBehaviors: [],
      allAreas: [],
      allBehaviors: [],
      checkpointDay: 'Sunday',
    }
    this.assessmentScreen.bind(this);
    navigation.state.params.assessmentComplete.bind(this);

  }
  _startQuiz(){
    this.setState({ screen:'quiz' })
  }
  _quizFinish(score){    
    this.setState({ screen:'finish', score : score })
  }

  _questionFinish(result, check){
    this.setState({questionRight: result})
    this.setState({questionDone:check})
  }

  _updateProgress(progress){

    this.setState({ progress: progress})
  }

  _seeStreaks(){
    this.setState({ screen: 'streak'})
  }

  _seeResults(){
    fetch('GET', 'recommendedArea')
      .then(({
        area_id: areaId,
        area_name: recArea,
      }) => {
        this.updateArea({ recArea, areaId });
        this.fetchAllAreas();
        this.setState({ screen: 'result' });
      })
      .catch(console.error);
  }

  updateArea(recAreaId) {
    const { recArea, areaId } = recAreaId;

    this.setState({
      areaId,
      recArea,
      recBehaviors: [],
    });

    this.fetchSuggestedBehaviors(areaId);
    this.fetchAllBehaviors(areaId);
  }

  fetchSuggestedBehaviors(areaId) {
    return fetch('GET', 'suggestedBehaviors', { areaId })
      .then((responseJson) => {
        this.setState({
          recBehaviors: responseJson,
        });
      })
      .catch(console.error);
  }

  fetchAllBehaviors(areaId) {
    this.setState({ allBehaviors: [] });

    return fetch('GET', 'allBehaviors', { areaId })
      .then((responseJson) => {
        this.setState({
          allBehaviors: responseJson,
        });
      })
      .catch(console.error);
  }

  fetchAllAreas() {
    fetch('GET', 'allAreas')
      .then((responseJson) => {
        const nameIdPairs = responseJson.map(({ area_id, area_name }) => [area_name, area_id]);
        this.setState({
          allAreas: responseJson.map((area) => area.area_name),
          areaNameToId: Object.fromEntries(nameIdPairs),
        });
      })
      .catch(console.error);
  }

  _exitAssessment(){
    this.props.navigation.state.params.assessmentComplete();
    this.props.navigation.goBack();

  }

  _seeTutorial(){
    this.setState({ screen: 'tutorial'})
  }

  _seeSetCheckpointDay() {
    this.setState({ screen: 'setCheckpointDay' });
  }

  finishOnPressNext = () => {
    const { assessmentType } = this.state;
    switch (assessmentType) {
      case 'initial': this._seeResults(); break;
      case 'review': this._seeStreaks(); break;
      default: this._exitAssessment();
    }
  };

  resultOnPressNext = () => {
    // TODO: server POST requests for areaID

    fetch('POST', 'chooseBehaviors', { behaviorIds: this.state.recBehaviors.map((val) => val.behavior_id)})
      .catch(console.error);

    const { assessmentType } = this.state;
    if (assessmentType === 'initial') {
      this._seeSetCheckpointDay();
    } else {
      this._exitAssessment();
    }
  };
  
  assessmentScreen(){
    const { navigation } = this.props
    const scrollX = new Animated.Value(0)
    const { assessmentType } = this.state;

    switch(this.state.screen){
      case 'start':
        
        return (
        <View style={styles.darkContainer}>

          <ProgressNavBar navigation={navigation} color={theme.TEXT_COLOR}/>
          <View style={styles.startScreen}>
              <Image source={require("../assets/images/heart.png")} style={styles.mainImageContainer}/>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon name="access-time" color={theme.TEXT_COLOR} size={17}/>
                <Text style={[{color:theme.TEXT_COLOR, marginBottom:5, marginLeft:5,},textStyle.caption]}>
                  ~15 minutes
                </Text>
              </View>
              <View style={{marginTop: 10, width:'100%'}}>

                <NextButton 
                onPress={() => this._startQuiz()} 
                title="Get Started"/>
                <Text style={[{color:theme.TEXT_COLOR, marginTop: 30},textStyle.subheader]}>
                  Why should I take this assessment?
                </Text>
                <Text style={[{color:theme.TEXT_COLOR, marginTop: 15, lineHeight: 20, opacity: 0.5},textStyle.paragraph]}>
                This purpose of this short assessment is to allow us to 
                better understand your relationship behaviors and relationship 
                health so that we can figure out how to best help you.
                </Text>
              </View>

          </View> 
        </View>
        );

      case 'finish':
        return (
          <View style={styles.darkContainer}>
            <View style={styles.startScreen}>
              <Image
                source={require("../assets/images/heart.png")}
                style={[styles.mainImageContainer, { marginBottom: 0 }]}
              />
              <View width={246/* fit "Congrats..." exactly */}>
                <Text style={[textStyle.header, {color:theme.TEXT_COLOR, textAlign: 'center'}]}>
                  Congrats, you did it!
                </Text>
                {assessmentType === 'initial' && (
                  <Text style={[textStyle.paragraph,{marginTop: 15, marginBottom: 15, opacity: 0.5}]}>
                    By taking this assessment, we’re able to better assess 
                    your relationship health and behaviors and inform you of healthy 
                    next steps!
                  </Text>
                )}
              </View>
            </View> 
            <View style={styles.nextButtonContainer}>
              <NextButton 
              onPress={this.finishOnPressNext}
              title="NEXT >"/>
            </View>
          </View>
        );

      case 'quiz':
        return (
          <View style={this.state.questionDone ? (this.state.questionRight? styles.correctContainer : styles.incorrectContainer) : styles.darkContainer}>

            <ProgressNavBar
              color={theme.PRIMARY_COLOR}
              navigation={navigation}
              progress={this.state.progress}
              confirmAction
            />
            <AssessmentQuestions quizFinish={(score) => this._quizFinish(score)}
                                 questionFinish={(result,check) => this._questionFinish(result,check)}
                                 updateProgress={(progress) => this._updateProgress(progress)}
                                 assessmentType = {this.state.assessmentType}
                                 behaviorId = {this.state.behaviorId}
                                 behaviors={this.behaviors}
                                 nextButtonContainerStyle={styles.nextButtonContainer}
                                 />
          </View>
        );
      case 'streak':
        setTimeout(this._seeResults.bind(this), 1000);
        return (
        <View style={[styles.startScreen, styles.darkContainer]}>
            <Image source = {require('../assets/images/streak/streak-fire.png')} style={{width: 120, height: 120}}/>
            <Text style={[{marginLeft:70, marginRight:70, marginTop: 40}, textStyle.header,{color:theme.TEXT_COLOR}]}>
                Streak +1
            </Text>
        </View> 
        );
      case 'result':
        const {
          recArea,
          recBehaviors,
          areaNameToId,
          allAreas,
          allBehaviors,
        } = this.state;

        const changeRecArea = (recArea) => {
          if (this.state.recArea !== recArea) {
            this.updateArea({
              recArea,
              areaId: areaNameToId[recArea],
            });
          }
        };

        const changeRecBehavior = (indexInRecList, indexInFullList) => {
          this.setState(({ recBehaviors: oldRecBehaviors }) => {
            const newRecBehaviors = oldRecBehaviors.slice();
            newRecBehaviors[indexInRecList] = allBehaviors[indexInFullList];
            return { recBehaviors: newRecBehaviors };
          });
        };

        return (
          <ResultsPage
            styles={styles}
            recArea={recArea}
            onPressNext={this.resultOnPressNext}
            recBehaviors={recBehaviors.map((val) => val.behavior_name)}
            onPressNewFocus={changeRecArea}
            onPressNewBehavior={changeRecBehavior}
            focusList={allAreas}
            behaviorList={allBehaviors.map((behavior) => behavior.behavior_name)}
          />
        );
      case 'setCheckpointDay':
        const onPressCheckpointDay = (checkpointDay) => {
          this.setState({ checkpointDay });
        };

        const setAssessDay = (assessDay) => {
          fetch('POST', 'setAssessDay', { assessDay })
            .catch(console.error);

          this._exitAssessment();
        };

        const setCheckpointDayOnPressNext = () => {
          setAssessDay(longDayNames.indexOf(this.state.checkpointDay));
        };

        return (
          <SetCheckpointDayPage
            styles={styles}
            onPressCheckpointDay={onPressCheckpointDay}
            selectedDay={this.state.checkpointDay}
            onPressNext={setCheckpointDayOnPressNext}
          />
        );
      case 'tutorial':
        const tips = [
          {
            'text':'Learning',
            'description': 'learning stuff',
          },
          {
            'text':'Implementation',
            'description': 'implementation stuff',
          },
          {
            'text':'Checking in',
            'description': 'checking in stuff',
          },
        ]
        return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}
        >
          <ScrollView
                  contentContainerStyle={styles.contentContainer}
                  horizontal= {true}
                  decelerationRate={0}
                  snapToInterval={width}
                  snapToAlignment={"center"}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: {
                          contentOffset: {
                            x: scrollX
                          }
                        }
                      }
                    ],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={1}
                  >
              {tips.map((tip, index)=> (
                <View style={[styles.scrollScreen]} key={index}>

                  <Image
                    source={require("../assets/images/heart.png")}
                    style={[
                      styles.mainImageContainer,
                      { height: 250, width: 250 },
                    ]}
                  />
                  <Text
                    style={[
                      textStyle.header,
                      {
                        color:theme.TEXT_COLOR,
                        marginBottom: 20,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    {tip['text']}
                  </Text>
                  <Text
                    style={[
                      textStyle.paragraph,
                      {
                        color:theme.TEXT_COLOR,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    {tip['description']}
                  </Text>
                </View> 

              ))}

          </ScrollView>
          <View style={styles.nextButtonContainer}>
            <Animated.View
              top={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [100, 0],
                extrapolate: 'clamp',
              })}
              opacity={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              })}
            >
              <NextButton 
                onPress={() => this._exitAssessment()} 
                title="NEXT >"
              />
            </Animated.View>
            <Animated.View
              alignSelf="center"
              position="absolute"
              flexDirection="row"
              width={width}
              paddingHorizontal={60}
              alignItems="center"
              justifyContent="space-between"
              top={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [13, 90],
                extrapolate: 'clamp',
              })}
              opacity={scrollX.interpolate({
                inputRange: [width, 2 * width],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              })}
            >
              <View flexDirection="row">
                 {tips.map((_, index) => {
                  
                  const iwidth = scrollX.interpolate({
                    inputRange: [
                      width * (index - 1),
                      width * index,
                      width * (index + 1)
                    ],
                    outputRange: [8, 16, 8],
                    extrapolate: "clamp"
                  });
                  console.log("width "+ width + " index " + index + " scrollX" + scrollX + "iwidth" + iwidth)
                  return (
                    <Animated.View
                      key={index}
                      style={[styles.normalDot, { width: iwidth}]}
                    />
                  );
                })}
              </View>
              <TouchableOpacity onPress={() => this._exitAssessment()}>
                <Text style={[textStyle.label, { color: theme.TEXT_COLOR }]}>
                  SKIP
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        );

    }
  }

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden />
        {
         this.assessmentScreen()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  darkContainer: {
    flex: 1,
    backgroundColor:theme.SECONDARY_COLOR,
  },
  correctContainer: {
    flex: 1,
    backgroundColor: theme.CORRECT_COLOR_BG,
  },
  incorrectContainer: {
    flex: 1,
    backgroundColor: theme.INCORRECT_COLOR_BG,
  },
  headerText:{
    color:theme.TEXT_COLOR,
  },
  startEndParagraph:{
    color:theme.TEXT_COLOR, 
    marginTop: 15,
    marginBottom: 20,
    fontSize:15, 
    lineHeight: 20,
  },
  scrollScreen:{
    flex:1,
    alignItems: 'center',
    textAlign:'center',
    justifyContent: 'center',
    width:width,
    paddingHorizontal: 60,
  },
  startScreen: {
    flex:1,
    alignItems: 'center',
    textAlign:'center',
    justifyContent: 'center',
    paddingHorizontal: '15%',

  },
  mainImageContainer:{
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: theme.TEXT_COLOR,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  nextButtonContainer: {
    width: 275,
    alignSelf: 'center',
    top: -45,
  },
});
