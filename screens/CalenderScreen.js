import React, { Component } from 'react';
import Modal from 'react-native-modal';
import Collapsible from 'react-native-collapsible';
import { _getAuthTokenUserId } from '../constants/Helper.js'
import host from '../constants/Server.js';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Moment from 'moment';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  Arrow,
  AsyncStorage,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

var originalFetch = require('isomorphic-fetch');
var fetch = require('fetch-retry')(originalFetch);

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


export default class ArticleScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      userId:'',
      authToken:'',
      isCollapsed:true,
      screen:'closed',
      entryRating:0,
      opening:true,
      moodColors: ['#FFFFFF','#94ADFF', '#FFCA41', '#FFC3BD', '#FF998E', '#FF7D71'],
      moodName: ['error','awful', 'down', 'alright', 'good', 'amazing'],
      markedDates: {},
      day: new Date(),
      entry: '',
    };
  }

    open = (day) => {
      if (!this.in_markedDates(day)) {
        console.log('open')
        this.setState({
          day:day,
          screen:'open',
          opening:true
        });
      }
      else{
        console.log('view ' + this.state.entryRating)
        this.setState({
        day:day,
        screen:'view',
        opening:true,
        entryRating:this.state.markedDates[day.dateString]['entryRating']
        });
        console.log('view end')
      }
    }

    async close(){
      if (this.state.entryRating != 0){
        const _selectedDay = this.state.day.dateString;
        let marked = true;
        if (this.state.markedDates[_selectedDay]) {
          // Already in marked dates, so reverse current marked state
          marked = !this.state.markedDates[_selectedDay].marked;
        }
        // Create a new object using object property spread since it should be immutable
        // Reading: https://davidwalsh.name/merge-objects
        this.updateDate(_selectedDay, this.state.entry, this.state.entryRating);
        this.setState({screen:'closed'});
        console.log("POSTED RESPONSE ")
      //   const data ={
      //     userId: '5',
      //     authToken: '4ea711f7f1146c8de28612d2700ff102',
      //     entryDate: (this.state.day).dateString,
      //     entry:this.state.entry,
      //     entryRating:this.state.entryRating,
      //   };
      //
      //   fetch('http://'+host+':3000/writeEntry/', {
      //         method: 'POST',
      //         headers: {
      //           Accept: 'application/json',
      //                   'Content-Type': 'application/json'
      //         },
      //        body: JSON.stringify(data)
      //     })
      // }
      // handleEntry = (text) => {
      //   this.setState({ entry: text })
      }
    }

    updateDate = (_selectedDay, entry, entryRating) => {
        const updatedMarkedDates = {
        ...this.state.markedDates,
        ...{
          [_selectedDay]: {
            customStyles: {
              container: { backgroundColor: this.state.moodColors[entryRating], borderRadius: 100 },
            },
            entry: entry,
            entryRating: entryRating,
          },
        },
      };
    //console.log(this.state.markedDates);
    // Triggers component to render again, picking up the new state
    this.setState({ markedDates: updatedMarkedDates });
    console.log(this.state.markedDates)

    };

    async componentDidMount(){
        const {authToken, userId} = await _getAuthTokenUserId()
        this.setState({
          userId:userId,
          authToken:authToken,
        })
        console.log(Moment(this.state.day).format('YYYY-MM-DD'))
        console.log('getting month entry' + userId +' ' + authToken)
        var currDate = new Date();
        const month = JSON.stringify(currDate.getMonth()+1);
        const year = JSON.stringify(currDate.getFullYear());
        let url = 'http://192.241.153.104:3000/monthEntries/'+userId+'/'+authToken+'/' + month + '/' + year;
        const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              }
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log('updatingDate')
            responseJson.map((entry, i)=>{
              this.updateDate((entry["entry_date"]).substring(0,10),entry['entry'], entry['entry_rating'])
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }


      async getEntry(day){
        console.log('getEntry')
        var _markedDate = this.state.markedDates[day.dateString]
        this.setState({
          entryRating:_markedDate['entryRating'],
          entry: _markedDate['entry']
        })
      }

      in_markedDates(day){
        const keys = Object.keys(this.state.markedDates);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] == day.dateString){
            return true
          }
        }
        return false
      }

      componentDidUpdate(prevState){
        if (this.state.screen != 'closed'&& this.state.opening == true) {
          if (this.in_markedDates(this.state.day)) {
            this.getEntry(this.state.day)
            console.log("not empty")
           } else {
             this.setState({
               entryRating:0,
               screen:'open',
               entry:'',
             });
             console.log('empty')
         };
         this.setState({opening:false})
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
            <Text style = {styles.titleText}>How do you feel about your relationship today?</Text>
            </View>
            </TouchableOpacity>
            </View>
          );
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
          case 'view':
            var date = new Date(this.state.day.dateString)
            return(
              <View style = {styles.openContainer}>
              <Text style = {styles.titleText}>{monthNames[date.getMonth()]} {date.getDate()+1}</Text>
              <Text style = {styles.titleText}>I felt {this.state.moodName[this.state.entryRating]} about my relationship</Text>
              <Text style={styles.titleText}>{this.state.entry}</Text>
              <TouchableOpacity
                onPress={()=>this.close()}
                style={styles.button}>
              </TouchableOpacity>
              </View>
          );
          default:
            Alert.alert("SCREEN DNE");
      }
    }
    render(){
      let moods = (this.state.moodColors.slice(1,6)).map((color, i) => {
      return (
        <TouchableOpacity
          key={i.toString()}
          onPress={() => this.setState({entryRating:(i + 1)})}
          style={[
            styles.moodButton,
            { backgroundColor: color },
          ]}></TouchableOpacity>
      );
    });
      return(
        <View>
        <Calendar
  onDayPress={this.open}
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
