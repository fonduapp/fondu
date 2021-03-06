import React, { Component } from 'react';
import Modal from 'react-native-modal';
import Collapsible from 'react-native-collapsible';
import {textStyle} from '../styles/text.style.js';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Icon} from 'react-native-elements';
import Moment from 'moment';
import {
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  Alert,
  Arrow,
  AsyncStorage,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import fetch from '../utils/Fetch';

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const moodIcons= ['mood-bad','sentiment-dissatisfied','sentiment-satisfied','mood','sentiment-very-satisfied'];
const moodColors= ['#FFFFFF','#94ADFF', '#FFCA41', '#FFC3BD', '#FF998E', '#FF7D71'];


export default class ArticleScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isCollapsed:true,
      screen:'closed',
      entryRating:0,
      opening:false,
      closing:true,
      moodName: ['error','awful', 'down', 'alright', 'good', 'amazing'],
      moodOpacity:[1,1,1,1,1],
      markedDates: {},
      day: {dateString:Moment(new Date()).format('YYYY-MM-DD')},
      today:{dateString:Moment(new Date()).format('YYYY-MM-DD')},
      entry: '',
    };
  }

    open (day) {
      if(day.dateString<=this.state.today.dateString){
      this.setState({
          day:day,
          opening:true
        });
      }
      }

      moodPressed (mood) {
        let tempMoodOpacity = this.state.moodOpacity;
        this.setState({entryRating:(mood + 1)});
        for (let i = 0; i < 5; i++){
          if (i==mood){
            tempMoodOpacity[i] = 1;
          }else{
            tempMoodOpacity[i] = .5;
          }
        }
        console.log(tempMoodOpacity)
        this.setState({moodOpacity:tempMoodOpacity})
      }

    close(){
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
        const data ={
          entryDate: (this.state.day).dateString,
          entry:this.state.entry,
          entryRating:this.state.entryRating,
        };

        fetch('POST', 'writeEntry', data);
      }
      this.setState({
        closing:true,
      });

    }
    handleEntry = text => {
      this.setState({ entry: text })

    };

    updateDate = (_selectedDay, entry, entryRating) => {
      var updatedMarkedDates
      if (_selectedDay == this.state.today.dateString){
        updatedMarkedDates = {
        ...this.state.markedDates,
        ...{
          [_selectedDay]: {
            customStyles: {
              container: { borderColor: moodColors[entryRating], borderWidth: 3, borderRadius: 100 },
            },
            entry: entry,
            entryRating: entryRating,
          },
        },
      };
    }else{
        updatedMarkedDates = {
        ...this.state.markedDates,
        ...{
          [_selectedDay]: {
            customStyles: {
              container: { backgroundColor: moodColors[entryRating], borderRadius: 100 },
            },
            entry: entry,
            entryRating: entryRating,
          },
        },
      };
    }
    this.setState({ markedDates: updatedMarkedDates });
    };

    async componentDidMount(){
        var currDate = new Date();
        const month = JSON.stringify(currDate.getMonth()+1);
        const year = JSON.stringify(currDate.getFullYear());
        this.fetchMonth(month,year)
      }

      async fetchMonth(month,year){
        const response = await fetch('GET', 'monthEntries', { month, year })
          .then((responseJson) => {
            responseJson.map((entry, i)=>{
              this.updateDate((entry["entry_date"]).substring(0,10),entry['entry'], entry['entry_rating'])
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }


      getEntry(day){
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

      get_containerColor(){
        if (this.state.entryRating == 1){
          return ['#475279', '#7881A1']
        }else{
          return ['#7B80FF','#94ADFF']
        }
      }

      componentDidUpdate(prevState){
        if (this.state.opening == true) {
          if (this.in_markedDates(this.state.day)) {
            this.getEntry(this.state.day)
            this.setState({screen:'open-selected'})
           } else {
             this.setState({
               entryRating:0,
               screen:'open-unselected',
               entry:'',
             });
         };
         this.setState({opening:false})
       }
       if (this.state.closing == true) {
         if (this.in_markedDates(this.state.day)) {
           this.setState({screen:'closed-selected'})
          } else {
            this.setState({
              screen:'closed-unselected',
            });
        };
        this.setState({closing:false})

       }

     }

    switchScreens=(moods, date, color, entry)=>{
      switch(this.state.screen){

        case 'closed-unselected':
        //closed-unselected
          return(
            <View>
            <TouchableOpacity
            style = {[styles.closedContainer, {backgroundColor:color[0]}]}
            onPress={()=>this.open(this.state.day)}>
            <View style = {styles.headerContainer}>
              <Text style = {styles.subtitleText}>{date.getDate()+1} {monthNames[date.getMonth()]}</Text>
            </View>

            <Text style = {styles.titleText}>How do you feel about your relationship today?</Text>
            </TouchableOpacity>
            </View>
          );
          case 'closed-selected':
          //closed-selected
            return(
              <View>
                <TouchableOpacity
                style = {[styles.closedContainer, {backgroundColor:color[0]}]}
                onPress={()=>this.open(this.state.day)}>
                <View style = {styles.headerContainer}>
                  <Text style = {styles.subtitleText}>{date.getDate()+1} {monthNames[date.getMonth()]}</Text>
                </View>
                <View style = {styles.entryRatingContainer}>
                <Text style = {styles.titleText}>I felt {this.state.moodName[this.state.entryRating]} about my relationship</Text>


                </View>
                </TouchableOpacity>
              </View>
            );
        case 'open-unselected':
        //open-unselected
          return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style = {[styles.openContainer, {backgroundColor:color[0]}]}>
              <View style = {styles.headerContainer}>
                <Text style = {[styles.subtitleText, {color:color[1]}]}>{date.getDate()+1} {monthNames[date.getMonth()]} </Text>
                <Icon
                  name={'keyboard-arrow-down'}
                  type='material'
                  color='#FFFFFF'
                  onPress={()=>this.close()}
                  size={30}/>
                </View>
            <Text style = {styles.titleText}>How do you feel about your relationship today?</Text>
            <View style={styles.moodButtonContainer}>
              {moods}
            </View>
              <View style={{flex: 1}}>
                <TextInput
                style={[styles.textInputContainer, {backgroundColor:color[1]}]}
                onChangeText={this.handleEntry}
                value={entry}
                multiline
                ></TextInput>
                </View>
            <Icon
              name={'check-circle'}
              type='material'
              color='#FFFFFF'
              onPress={()=>this.close()}
              size={45}/>

            </View>
            </TouchableWithoutFeedback>


          );
          case 'open-selected':
            //open-selected
            return(
              <View style = {[styles.openContainer2, {backgroundColor:color[0]}]}>
                <View style = {styles.headerContainer}>
                  <Text style = {[styles.subtitleText, {color:color[1]}]}>{monthNames[date.getMonth()]} {date.getDate()+1}</Text>
                  <Icon
                    name={'keyboard-arrow-down'}
                    type='material'
                    color='#FFFFFF'
                    onPress={()=>this.close()}
                    size={30}/>
                </View>
              <Text style = {styles.titleText}>I felt {this.state.moodName[this.state.entryRating]} about my relationship</Text>
              <View style = {[styles.entryContainer,{backgroundColor:color[1]}]}>
                <Text style={styles.entryText}>{this.state.entry}</Text>
              </View>
              <Icon
                name={'check-circle'}
                type='material'
                color='#FFFFFF'
                onPress={()=>this.close()}
                size={45}/>
              </View>
          );

      }
    }
    render(){
      const { entry } = this.state;
      let moods = (moodColors.slice(1,6)).map((color, i) => {
      return (
        <Icon
          name={moodIcons[i]}
          type='material'
          color='#FFFFFF'
          size={40}
          onPress={() => this.moodPressed(i)}
          containerStyle={[
            styles.moodButton,
            { backgroundColor: color, opacity:this.state.moodOpacity[i]},
          ]}></Icon>
      );
    });
      return(
        <View>
        <Calendar
  onDayPress={(day)=>this.open(day)}
  monthFormat={'MMMM yyyy'}
  onMonthChange={(month) => this.fetchMonth(month.month,month.year)}
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
  theme={{
   backgroundColor: '#ffffff',
   calendarBackground: '#ffffff',
   textSectionTitleColor: '#d4d3ff',
   textSectionTitleDisabledColor: '#d9e1e8',
   selectedDayBackgroundColor: '#00adf5',
   selectedDayTextColor: '#ffffff',
   todayTextColor: '#00adf5',
   dayTextColor: '#475279',
   textDisabledColor: '#d9e1e8',
   monthTextColor: '#7B80FF',
   indicatorColor: 'blue',
   textDayFontFamily: 'poppins-regular',
   textMonthFontFamily: 'poppins-bold',
   textDayHeaderFontFamily: 'poppins-medium',
   textDayFontSize: 16,
   textMonthFontSize: 24,
   textDayHeaderFontSize: 13
 }}
/>
  {this.switchScreens(moods, new Date(this.state.day.dateString), this.get_containerColor(), entry)}
  </View>

);}
    }

const styles = StyleSheet.create({
  titleText: {
    color: '#FFFFFF',
    ...textStyle.header,
    marginBottom: 20,
  },
  subtitleText: {
    color: '#94ADFF',
    ...textStyle.header4,
  },

  headerContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingBottom:10,
  },
  entryRatingContainer:{
    flexDirection:'row',
    lineHeight:10,
    flexWrap:'wrap',
    margin:0,
  },

  entryContainer:{
    borderRadius:10,
    backgroundColor: '#94ADFF',
    padding:20,
    marginBottom:20,
  },
  entryText:{
    color:'#FFFFFF',
    ...textStyle.paragraph,
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

  openContainer2: {
    width: width,
    height: height/2,
    paddingLeft: width / 10,
    paddingRight: width / 10,
    paddingTop: width / 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    top: (height) / 3,
    position: 'absolute',
  },
  moodButton: {
    justifyContent:'center',
    alignItems:'center',
    height: width / 10,
    width: width / 10,
    borderRadius: 100,
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
    paddingLeft:20,
    marginRight: 20,
    marginVertical: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#94ADFF',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'space-around',
    ...textStyle.subtitle,
  },
});
