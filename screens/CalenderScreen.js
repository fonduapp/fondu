import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { format } from "date-fns";
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
      mood:0,
      moodColors: ['#94ADFF', '#FFCA41', '#FFC3BD', '#FF998E', '#FF7D71'],
      markedDates: {},
      day: Date(),
      entry: '',
    };
    }
    open = () => {
      this.setState({screen:'open'});
      console.log("opened")
    }
    close = () => {
      this.setState({screen:'closed'});
      this.updateDate((this.state.day).dateString);
      console.log("closed")
    }
    handleEntry = (text) => {
      this.setState({ entry: text })
    }
    pressMood = (id) => {
     this.setState({ mood: id });
     console.log(this.state.mood)
    };
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

      componentDidMount(){
        //const {authToken, userId} = await _getAuthTokenUserId();
        //console.log('userid ' + userId + "\t authToken " + authToken);
        console.log('mounting ')

        var currDate = new Date("2020-02-02T10:34:23");
        const month = JSON.stringify(currDate.getMonth()+1);
        const year = JSON.stringify(currDate.getFullYear());
        console.log('month '+ month + ' year ' + year)

        return fetch('http://192.241.153.104:3000/monthEntries/2/abcdefg/' + month + '/' + year)
          .then((response)=>response.text())
          console.log('text')
          console.log(response)
          .then((responseJson) =>{
            //console.log((responseJson))
            //dates = JSON.parse(responseJson);
            // dates.map((date, id) =>{
            //   this.updateDate(currDate.dateString);
            // })
          })
          .catch((error)=>{
            console.log(error)
          });
      }

      componentDidUpdate(){
        //const {authToken, userId} = await _getAuthTokenUserId();
        //console.log('userid ' + userId + "\t authToken " + authToken);
        console.log('updating ')

        var currDate = new Date("2020-02-02T10:34:23");
        const month = JSON.stringify(currDate.getMonth()+1);
        const year = JSON.stringify(currDate.getFullYear());
        console.log('month '+ month + ' year ' + year)

        return await fetch('http://192.241.153.104:3000/monthEntries/2/abcdefg/' + month + '/' + year)
          .then((response)=>response.text())
          console.log('text')
          console.log(response)
          .then((responseJson) =>{
            console.log('fetched')

            console.log((responseJson))
            dates = JSON.parse(responseJson);
            // dates.map((date, id) =>{
            //   this.updateDate(currDate.dateString);
            // })
          })
          .catch((error)=>{
            console.log(error)
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
        console.log('uodating')
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
      let moods = this.state.moodColors.map((color, i) => {
      return (
        <TouchableOpacity
          key={i.toString()}
          onPress={() => this.pressMood(i)}
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
