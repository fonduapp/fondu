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
import ProgressRing from '../components/ProgressRing';
import { Icon, Avatar } from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';


const { width } = Dimensions.get('window');
const mainPadding = 30;

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    scrollBarValue: new Animated.Value(0),
    accountPairedNotif: true,
  };

  _moveScrollBar = (event) => {
    Animated.timing(this.state.scrollBarValue, {
      toValue: (event.nativeEvent.contentOffset.x*(width-mainPadding*2)/width)/3,
      duration: 0
    }).start();

  };



  render() {
    let { scrollBarValue } = this.state;
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