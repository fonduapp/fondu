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
      markedDates:{},
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

      selectDate = (day, value) => {
        let markedDates = {...this.state.markedDates,...{ [day.dateString]: { value} } }
        console.log('pressed dates1' + day.dateString)
        //markedDates[day.dateString] =  2;
        console.log('pressed dates2' + markedDates[day.dateString])

        this.setState({markedDates:markedDates});
        console.log('pressed dates3' + this.state.markedDates)
      }

      onDaySelect = (day) => {
            const _selectedDay = day.dateString;

            let marked = true;
            if (this.state.markedDates[_selectedDay]) {
              // Already in marked dates, so reverse current marked state
              marked = !this.state.markedDates[_selectedDay].marked;
            }
            // Create a new object using object property spread since it should be immutable
            // Reading: https://davidwalsh.name/merge-objects
            const updatedMarkedDates = {...this.state.markedDates, ...{ [_selectedDay]: {customStyles:{container: {backgroundColor: '#7B80FF', borderRadius:100},}}}}
            console.log(this.state.markedDates)
            // Triggers component to render again, picking up the new state
            this.setState({ markedDates: updatedMarkedDates });
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
            <Text style = {styles.titleText}>How do you feel about your relationship today?</Text>
            </View>
            </TouchableOpacity>
            </View>
          );
          break;
        case 'open':
          return(
            <View style = {styles.openContainer}>

            <Text style = {styles.titleText}>How do you feel about your relationship today?</Text>
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
  onDayPress={this.onDaySelect}
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
  markedDates ={this.state.markedDates}
  markingType={'custom'}
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
    selectedStyle:{
        backgroundColor:'#FF0000',
        borderRadius:100,
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
