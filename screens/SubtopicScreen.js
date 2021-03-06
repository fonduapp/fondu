import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator } from 'react-native';
import { ListItem, SearchBar, Icon} from 'react-native-elements';
import {DropDownItem} from 'react-native-drop-down-item';
import { ExpoLinksView } from '@expo/samples';
import { createStackNavigator } from 'react-navigation-stack';
import { StackNavigator } from 'react-navigation';
import {textStyle} from '../styles/text.style.js';
import { getMatch } from '../utils/Helper.js'
import fetch from '../utils/Fetch';

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;
const arrows = ['keyboard-arrow-down','keyboard-arrow-up']

export default class SubtopicScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      showInfo:false,
      subList:[],
      area_name:'',
      area_text:'',
      matches:[],
      isSearching:false,
      search:'',
      prev:'',
    }
    this.getMatch = getMatch.bind(this);
  }


  static navigationOptions = ({navigation}) => {
    const {params ={}} = navigation.state;
    let headerTitle = params.title;
    let headerTitleStyle = {
      textAlign:'center',
      ...textStyle.header4,
      color:"#7B80FF",
    };
    let headerRight =(
      <Icon
       name={'questioncircleo'}
       type='antdesign'
       color='#7B80FF'
       containerStyle={{paddingRight:20}}
       onPress={()=>params.toggle()}
       size={25}/>

    )
    return{headerTitle,headerTitleStyle,headerRight}
  }

  toggle(){
    this.setState({showInfo:!this.state.showInfo});
  }

  onChangeText = text =>{
    console.log("search text " + text)
    if (text==""){
      console.log("clear")
      this.setState({
        isSearching:false,
        search:'',
      });
    }else{
      this.setState({
        isSearching:true,
        search:text,
      });
  }
}



  showText(search, articles){
    if (!this.state.showInfo){
      return(
        <>
      <SearchBar
        containerStyle = {styles.searchContainer}
        inputContainerStyle = {{backgroundColor:"#D4D3FF"}}
        inputStyle = {{color:'#FFFFFF', fontSize:14}}
        placeholderTextColor = '#FFFFFF'
        placeholder = "Ask a question or search for a topic..."
        onChangeText={this.onChangeText}
        value = {search}
      />
      <View style = {styles.container}>
        {articles}
    </View>
    </>)
  }else{
    return(
    <View>

    <Text style = {styles.dropDownText}>{this.state.area_text}</Text>
    <SearchBar
      containerStyle = {styles.searchContainer}
      inputContainerStyle = {{backgroundColor:"#D4D3FF"}}
      inputStyle = {{color:'#FFFFFF', fontSize:14}}
      placeholderTextColor = '#FFFFFF'
      placeholder = "Search for a topic..."
      onChangeText={this.onChangeText}
      value = {search}
    />
    <View style = {styles.container}>
      {articles}
  </View>
  </View>

)}
  }

  componentDidMount(){
    const areaId = this.props.navigation.state.params.areaId;
    this.props.navigation.setParams({title:this.props.navigation.state.params.area_name, toggle:this.toggle.bind(this), showInfo:false});
    return fetch('GET', 'allBehaviors', { areaId })
      .then((responseJson) =>{
        this.setState({
          isLoading: false,
          subList:responseJson
        })
      })
      .then(()=>
      fetch('GET', 'area', { areaId })
        .then((responseJson) =>{
          this.setState({
            area_name:responseJson['area_name'],
            area_text:responseJson['area_text'],
        })
      }))
      .catch((error)=>{
        console.log(error)
      });
  }

  componentDidUpdate(){
    if (this.state.isSearching && this.state.prev != this.state.search){
      this.getMatch(this.state.search)
      this.setState({prev:this.state.search})
    }
  }

  render(){
    const { search } = this.state;
    const {navigation } = this.props;

    if (this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    } else {
      console.log("are you serch " + this.state.search)

      var articles;
      if (this.state.isSearching){
        var matchCount = 0;
        articles = (this.state.subList).map((article,i)=>{
            console.log(article['behavior_id'] + " " + this.state.isSearching)
            console.log(this.state.matches[0])
            console.log(this.state.matches.indexOf(article['behavior_id']) !== -1)
            if (this.state.matches.indexOf(article['behavior_id']) !== -1){
              matchCount++;
              return <TouchableOpacity
                    key = {i}
                    style = {styles.articleContainer}
                    onPress={()=> this.props.navigation.navigate('Article', {
                      behaviorId: article['behavior_id'],
                      behavior_name: article['behavior_name'],
                    })
                  }>
                      <Text style = {styles.buttonText}>
                          {article.behavior_name}
                      </Text>
                    </TouchableOpacity>
                  }
              });
      }else{
        console.log("show all")
        articles = (this.state.subList).map((article,i)=>{
            return <TouchableOpacity
                  key = {i}
                  style = {styles.articleContainer}
                  onPress={()=> this.props.navigation.navigate('Article', {
                    behaviorId: article['behavior_id'],
                    behavior_name: article['behavior_name'],
                  })
                }>
                    <Text style = {styles.buttonText}>
                        {article.behavior_name}
                    </Text>
                  </TouchableOpacity>
                });
      }
        return(
          this.showText(search,articles)
      );
    }
  }

}

// SubtopicScreen.navigationOptions = {
//   title: navigation.state.params.area_name,
// };

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection:'row',
    flexWrap: 'wrap',
    paddingTop: 15,
    justifyContent:"flex-start",
    backgroundColor: '#fff',
  },
  titleContainer: {
    height:height*1/20,
    flexDirection:'row',
    ///paddingTop: 15,
    //justifyContent:"center",
  },
  searchContainer:{
    borderRadius:50,
    backgroundColor:"#D4D3FF",
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft:20,
    marginRight:20,
    marginTop:height*.02,
    height: height * .07,
    justifyContent:'center',

  },
  articleContainer:{
    borderRadius: 15,
    width: width *.40,
    height: width *.40,
    justifyContent: 'center',
    marginTop: 20,
    marginLeft:(width * .20)/3,
    backgroundColor:'#7B80FF',
  },
  buttonText:{
    textAlign:'center',
    ...textStyle.subheader,
    fontSize:16,
    color:"#FFFFFF",
  },
  dropDownText:{
    textAlign:'left',
    paddingTop:20,
    paddingLeft:20,
    ...textStyle.paragraph,
    color:"#7B80FF",
  },
});
