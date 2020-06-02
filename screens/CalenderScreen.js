import React, { Component } from 'react';
import Modal from 'react-native-modal';
import Collapsible from 'react-native-collapsible';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  Arrow,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;

export default class ArticleScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isCollapsed:true,
      screen:'closed',
      mood:[0,0,0,0,0],
    };
    }
    open = () => {
      this.setState({screen:'open'});
      console.log("opened")
    }
    close = () => {
      this.setState({screen:'closed'});

      console.log("closed")
    }
    pressMood = (id) => {
        for(let i = 0; i < 5; i++){
          if (i == id){
            this.state.mood[i] = 1;
            console.log("mood pressed" + id)
          }else{
            this.state.mood[i] = 0;
          }
        }
      }


    switchScreens=(moods)=>{
      switch(this.state.screen){
        case 'closed':
          return(
            <View>
            <TouchableOpacity
            style = {styles.closedContainer}
            onPress={()=>this.open()}>
            <View>
            <Text style = {styles.titleText}>hihihihihihihihihihih</Text>
            </View>
            </TouchableOpacity>
            </View>
          );
          break;
        case 'open':
          return(
            <View style = {styles.openContainer}>

            <Text style = {styles.titleText}>hihihihihihihihihihih</Text>
            <View style={styles.moodButtonContainer}>
              {moods}
            </View>
            <TextInput
            style={styles.textInputContainer}/>
            <TouchableOpacity
              onPress={()=>this.close()}
              style={styles.button}>
            </TouchableOpacity>
            </View>

          );
          break;
          default:
            Alert.alert("SCREEN DNE");
      }
    }
    render(){
      let moods = this.state.mood.map((i)=>{
        return<TouchableOpacity
          onPress={()=>this.pressMood()}
          style={styles.moodButton}>
        </TouchableOpacity>
      });
      return(
        <View>
        <Calendar
  onDayPress={(day) => {console.log('selected day', day)}}
  onDayLongPress={(day) => {console.log('selected day', day)}}
  monthFormat={'yyyy MM'}
  onMonthChange={(month) => {console.log('month changed', month)}}
  hideArrows={false}
  hideExtraDays={true}
  disableMonthChange={true}
  firstDay={1}
  hideDayNames={false}
  showWeekNumbers={false}
  onPressArrowLeft={substractMonth => substractMonth()}
  onPressArrowRight={addMonth => addMonth()}
  disableArrowLeft={false}
  disableArrowRight={false}
/>
  {this.switchScreens(moods)}
  </View>

);}
    }
const styles = StyleSheet.create({
    titleText:{
      color: '#FFFFFF',
      fontWeight:'bold',
      fontSize: 16,
      lineHeight:20,
      marginBottom:20,

    },
    closedContainer:{
      backgroundColor: '#7B80FF',
      borderRadius: 50,
      height: height*.5,
      width:width,
      paddingLeft:width/16,
      paddingRight:width/16,
      paddingTop: width/16,
      justifyContent:'flex-start',
      position: 'absolute',
      top:0,
    },

    openContainer:{
      backgroundColor: '#7B80FF',
      height: height*2/3,
      width:width,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      top:height*1/6,
      position:'absolute',

    },
    moodButton:{
      backgroundColor: '#FFFFFF',
      height: width/10,
      width:width/10,
      borderRadius: 50,
    },
    button:{
      backgroundColor: '#FFFFFF',
      height: width/10,
      width:width/10,
      borderRadius: 50,
      alignSelf:'center',
    },

    moodButtonContainer:{
      flexDirection:'row',
      justifyContent:'space-around',
    },

    textInputContainer:{
      margin:30,
      justifyContent:'space-around',
    },
    });
