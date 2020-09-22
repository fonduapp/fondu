import React, { Component, createRef } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  findNodeHandle,
} from 'react-native';
import Dropdown from './Dropdown';
import { textStyle } from '../styles/text.style';
import NextButton from './NextButton';
import theme from '../styles/theme.style';
import ScrollButtonGroup from './ScrollButtonGroup';
import Color from 'color';
import { shadowStyle } from '../styles/shadow.style.js';

const contentWidth = 275;
const {
  width: screenWidth,
  height: screenHeight,
} = Dimensions.get('window');

export default class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenFocus: false,
      isOpenBehaviors: false,
      selectedBehaviorIndex: -1,
    };
    this.slideAnim = new Animated.Value(500);
    this.scroll = createRef();
    this.focusContainer = createRef();
    this.behaviorsContainer = createRef();
  }

  componentDidMount() {
    this.scrollNodeHandle = findNodeHandle(this.scroll.current);
    Animated.timing(this.slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  onPressFocusDropdown = () => {
    this.setState(({ isOpenFocus }) => ({
      isOpenFocus: !isOpenFocus,
      isOpenBehaviors: false,
      selectedBehaviorIndex: -1,
    }));
  };

  onPressBehaviorsDropdown = () => {
    this.setState(({ isOpenBehaviors }) => ({
      isOpenBehaviors: !isOpenBehaviors,
      isOpenFocus: false,
      selectedBehaviorIndex: isOpenBehaviors ? -1 : 0,
    }));
  };

  onPressRecBehavior = (index) => {
    this.setState({
      isOpenBehaviors: true,
      isOpenFocus: false,
      selectedBehaviorIndex: index,
    });
  };

  onAnimationEndDropdown = (container, maxHeight) => {
    container.current.measureInWindow((windowX, windowY, width, height) => {
      if (windowY > screenHeight - height) {
        container.current.measureLayout(this.scrollNodeHandle, (layoutX, layoutY) => {
          this.scroll.current.scrollTo({
            y: layoutY - screenHeight + maxHeight,
          });
        });
      }
    });
  };

  render() {
    const {
      styles,
      recArea,
      onPressNext,
      recBehaviors,
      onPressNewFocus,
      onPressNewBehavior,
      focusList,
      behaviorList,
    } = this.props;

    const {
      isOpenFocus,
      isOpenBehaviors,
      selectedBehaviorIndex,
    } = this.state;

    return (
      <View style={styles.darkContainer}>
        <View
          style={styles.startScreen}
          justifyContent="flex-start"
          paddingTop={62}
        >
          <Text style={[textStyle.header, {color:theme.TEXT_COLOR, alignSelf:'flex-start'}]}>
            Your Results
          </Text>
          <Text style={[textStyle.paragraph, {color:theme.TEXT_COLOR}]}>
            Based on the results of this assessment, we have calculated areas that you should focus a bit more on and areas that you are already excelling at.
          </Text>
        </View> 
        <Animated.View
          style={{
            transform: [{ translateY: this.slideAnim }],
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <ScrollView ref={this.scroll} showsVerticalScrollIndicator={false}>
            <View paddingTop={200}>
              <View height="100%">
                <View
                  position="absolute"
                  backgroundColor="white"
                  borderRadius={40}
                  width="100%"
                  top={100}
                  height="100%"
                />
                <View style={styleSheet.panelContentContainer}>
                  <Image
                    source={require("../assets/images/heart.png")}
                    style={styles.mainImageContainer}
                  />
                  <Text style={styleSheet.yourRecommendedText}>
                    YOUR RECOMMENDED FOCUS
                  </Text>
                  <View style={styleSheet.recAreaTextContainer}>
                    <Text style={styleSheet.recAreaText}>
                      {recArea}
                    </Text>
                  </View>
                  <View
                    ref={this.focusContainer}
                    style={styleSheet.dropdownContainer}
                    collapsable={false}
                  >
                    <Dropdown
                      key={focusList}
                      isOpen={isOpenFocus}
                      onPress={this.onPressFocusDropdown}
                      text="Choose another focus"
                      container={this.focusContainer}
                      onAnimationEnd={this.onAnimationEndDropdown}
                    >
                      <ScrollButtonGroup
                        contentWidth={contentWidth}
                        screenWidth={screenWidth}
                        itemList={focusList}
                        selectedItem={recArea}
                        onPress={onPressNewFocus}
                        scrollToSelected={isOpenFocus}
                        selectedButtonColor={theme.PRIMARY_COLOR_5}
                      />
                    </Dropdown>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styleSheet.yourRecommendedText}>
                      YOUR RECOMMENDED BEHAVIORS
                    </Text>
                  </View>
                  {recBehaviors.map((recBehavior, i) => {
                    const isSelected = i === selectedBehaviorIndex;
                    return (
                      <View key={recBehavior+i} style={styleSheet.buttonContainer}>
                        <TouchableOpacity
                          onPress={() => this.onPressRecBehavior(i)}
                          style={[styleSheet.button, isSelected ? styleSheet.selectedButton : {}]}
                          disabled={isSelected}
                        >
                          <Text style={[
                            styleSheet.buttonText,
                            isSelected ? styleSheet.selectedButtonText : {},
                          ]}>
                            {recBehavior}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  <View
                    ref={this.behaviorsContainer}
                    style={styleSheet.dropdownContainer}
                    collapsable={false}
                  >
                    <Dropdown
                      key={behaviorList}
                      isOpen={isOpenBehaviors}
                      onPress={this.onPressBehaviorsDropdown}
                      text="Choose other behaviors"
                      container={this.behaviorsContainer}
                      onAnimationEnd={this.onAnimationEndDropdown}
                    >
                      <ScrollButtonGroup
                        contentWidth={contentWidth}
                        screenWidth={screenWidth}
                        itemList={behaviorList}
                        selectedItem={recBehaviors[selectedBehaviorIndex]}
                        onPress={(index) => {
                          onPressNewBehavior(selectedBehaviorIndex, index);
                        }}
                        scrollToSelected={isOpenBehaviors}
                        selectedButtonColor={Color(theme.TEXT_COLOR).alpha(0.5).string()}
                        disabledItemList={recBehaviors}
                      />
                    </Dropdown>
                  </View>
                </View>
                <View style={styles.nextButtonContainer} marginTop={45}>
                  <NextButton 
                    onPress={onPressNext} 
                    title='NEXT >'
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styleSheet = StyleSheet.create({
  panelContentContainer: {
    width: contentWidth,
    alignSelf: 'center',
    alignItems: 'center',
  },
  yourRecommendedText: {
    ...textStyle.subheader,
    color: theme.TEXT_COLOR,
    opacity: 0.5,
  },
  recAreaTextContainer: {
    height: 75,
    justifyContent: 'center',
  },
  recAreaText: {
    ...textStyle.header,
    color: theme.PRIMARY_COLOR_6,
    textAlign: 'center',
  },
  dropdownContainer: {
    paddingBottom: 75,
    width: screenWidth,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 13,
  },
  button: {
    backgroundColor: theme.SECONDARY_COLOR,
    borderRadius: 20,
    height: 75,
    justifyContent: 'center',
    ...shadowStyle.primaryShadowStyle,
    paddingHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: Color(theme.TEXT_COLOR).alpha(0.8).string(),
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
  buttonText: {
    ...textStyle.header4,
    color: theme.TEXT_COLOR,
    opacity: 0.8,
    textAlign: 'center',
  },
  selectedButtonText: {
    color: 'white',
    opacity: 1,
  },
});
