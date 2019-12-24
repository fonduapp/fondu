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
import { Icon } from 'react-native-elements';
import theme from '../styles/theme.style.js';

const { width } = Dimensions.get('window');
const mainPadding = 40;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    scrollBarValue: new Animated.Value(0),
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
      <View style={styles.container}>
            <View style={styles.containerLabel}>
              <View style={styles.containerLabelContainer}>
                <Text style={styles.textContainer}>Focus</Text>
              </View>
              <View style={styles.containerLabelContainer}>
                <Text style={styles.textContainer}>Strength</Text>
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
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={width}
                snapToAlignment={"center"}
                showsHorizontalScrollIndicator={false}
                onScroll={this._moveScrollBar}>

                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainText}>Some behavior here</Text>
                  <Text>The definition of the behavior here</Text>

                  <View style={styles.recommendedSectionsContainer}>
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR_2}]} />
                    <View style={[styles.recommendedSection,{backgroundColor: theme.PRIMARY_COLOR_3}]} />
                  </View>
                </View>

                <View style={styles.welcomeSubContainer}>
                  <View style={styles.mainImageContainer}>
                  </View>
                  <Text style={styles.mainText}>Some other behavior here</Text>
                  <Text>The definition of the behavior here</Text>

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
}

HomeScreen.navigationOptions = {
  headerTitle: 'FondU',
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerLayoutPreset: 'center',
  headerTitleStyle :{textAlign:"center", 
        flex:1 },
  headerLeft: (<View style={{padding: 30}}><Icon name='face'/></View>), 
  headerRight: (<View style={{padding: 30}}><Icon name='whatshot' /></View>)
};

const styles = StyleSheet.create({
  textContainer: {
    color: theme.PRIMARY_COLOR
  },
  container: {
    flex: 1,
    color: '#7695FF'
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
  mainText:{
    fontSize: 20,
    fontWeight: 'bold',
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
