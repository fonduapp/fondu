import React, { Component } from 'react';
import Modal from 'react-native-modal';
import Collapsible from 'react-native-collapsible';
import host from '../constants/Server.js';
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
      mood:0,
      moodColors: ['#FFFFFF','#94ADFF', '#FFCA41', '#FFC3BD', '#FF998E', '#FF7D71'],
      markedDates: {},
      day: Date(),
      entry: '',
    };
  }

    open = () => {
      this.setState({
        mood:0,
        entry:'',
      });
      this.setState({screen:'open'});
      console.log("opened")
    }
    async close(){
      this.setState({screen:'closed'});
      this.updateDate((this.state.day).dateString);
      console.log("closed")
      if (this.state.mood != 0){
        await fetch('http://'+host+':3000/writeEntry/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
                      'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: '2',
              authToken: 'abcdefg',
              entryDate: this.state.day,
              entry:this.state.entry,
              entryRating:this.state.mood,
            })
        }).then((response) => console.log(response))
        .catch(function(error) {
          console.log( error.message);
          throw error;
        });
      }
    }
    handleEntry = (text) => {
      this.setState({ entry: text })
    }

    updateDate = (_selectedDay) => {
        const updatedMarkedDates = {
        ...this.state.markedDates,
        ...{
          [_selectedDay]: {
            customStyles: {
              container: { backgroundColor: this.state.moodColors[this.state.mood], borderRadius: 100 },
            },
          },
        },
      };
    //console.log(this.state.markedDates);
    // Triggers component to render again, picking up the new state
    this.setState({ markedDates: updatedMarkedDates });
    };

      async componentDidMount(){
        console.log('getting month entry')

        var currDate = new Date();
        const month = JSON.stringify(currDate.getMonth()+1);
        const year = JSON.stringify(currDate.getFullYear());
        console.log('month '+ month + ' year ' + year)
        let url = 'http://192.241.153.104:3000/monthEntries/2/abcdefg/' + month + '/' + year;
        const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              }
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            responseJson.map((entry, i)=>{
              this.setState({mood:(entry['entry_rating'])})
              this.updateDate((entry["entry_date"]).substring(0,10))
            });
            console.log(this.state.mood)
            console.log(this.state.markedDates)
          })
          .catch((error) => {
            console.error(error);
          });
      }




      onDaySelect = (day) => {
        const _selectedDay = day.dateString;
        this.setState({day: day})
        this.open();

        let marked = true;
        if (this.state.markedDates[_selectedDay]) {
          // Already in marked dates, so reverse current marked state
          marked = !this.state.markedDates[_selectedDay].marked;
        }
        // Create a new object using object property spread since it should be immutable
        // Reading: https://davidwalsh.name/merge-objects
        this.updateDate(_selectedDay);
      };

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
            style={styles.textInputContainer}
            onChangeText={this.handleEntry}/>
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
      let moods = (this.state.moodColors.slice(1,6)).map((color, i) => {
      return (
        <TouchableOpacity
          key={i.toString()}
          onPress={() => this.setState({mood:(i + 1)})}
          style={[
            styles.moodButton,
            { backgroundColor: color },
          ]}></TouchableOpacity>
      );
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
  titleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  closedContainer: {
    backgroundColor: '#7B80FF',
    borderTopLeftRadius: 50,
    borderTopRightRadius:50,
    height: height * 0.5,
    width: width,
    paddingLeft: width / 10,
    paddingRight: width / 10,
    paddingTop: width / 10,
    justifyContent: 'flex-start',
    position: 'absolute',
    top:10,
  },

  openContainer: {
    backgroundColor: '#7B80FF',
    width: width,
    height: height,
    paddingLeft: width / 10,
    paddingRight: width / 10,
    paddingTop: width / 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    top: (height * 1) / 6,
    position: 'absolute',
  },
  moodButton: {
    backgroundColor: '#FFFFFF',
    height: width / 10,
    width: width / 10,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#FFFFFF',
    height: width / 10,
    width: width / 10,
    borderRadius: 50,
    alignSelf: 'center',
  },
  selectedStyle: {
    backgroundColor: '#FF0000',
    borderRadius: 100,
  },

  moodButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  textInputContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 30,
    height: 30,
    borderRadius: 50,
    lineHeight: 40,
    backgroundColor: '#94ADFF',
    justifyContent: 'space-around',
  },
});
