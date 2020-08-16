import React from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator } from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import theme from '../styles/theme.style.js';
import { ExpoLinksView } from '@expo/samples';
import { createStackNavigator } from 'react-navigation-stack';
import { getMatch } from '../utils/Helper.js'
import {textStyle} from '../styles/text.style.js';
import fetch from '../utils/Fetch';



const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;

export default class ResourcesScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      articleList: [],
      matches:[],
      isSearching:false,
      search:'',
      prev:'',
    }
    this.getMatch = getMatch.bind(this);
  }


  onChangeText = text =>{
    if (text==""){
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


  static navigationOptions = ({navigation}) => {
    const {params ={}} = navigation.state;
    let headerTitle = 'Resources';
    let headerTitleStyle = {
      textAlign:'center',
      ...textStyle.header4,
      color:"#7B80FF",
    };
    return{headerTitle,headerTitleStyle}
  }

  componentDidMount(){
    return fetch('GET', 'allAreas')
      .then((responseJson) =>{
        this.setState({
          isLoading: false,
          articleList:responseJson
        })
      })
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
    const {navigation } = this.props;
    const { search } = this.state;
    console.log(search)
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
          articles = (this.state.articleList).map((article,i)=>{
              if (this.state.matches.indexOf(article['area_id']) !== -1){
                matchCount++;
                return <TouchableOpacity
                      key = {i}
                      style = {styles.articleContainer}
                      onPress={()=> this.props.navigation.navigate('Subtopics', {
                        areaId: article['area_id'],
                        area_name: article['area_name'],
                      })
                    }>
                        <Text style = {styles.buttonText}>
                            {article.area_name}
                        </Text>
                      </TouchableOpacity>
                    }
                });
        }else{
          articles = (this.state.articleList).map((article,i)=>{
              return <TouchableOpacity
                    key = {i}
                    style = {styles.articleContainer}
                    onPress={()=> this.props.navigation.navigate('Subtopics', {
                      areaId: article['area_id'],
                      area_name: article['area_name'],
                    })
                  }>
                      <Text style = {styles.buttonText}>
                          {article.area_name}
                      </Text>
                    </TouchableOpacity>
                  });
        }

          return(
            <View style={styles.resourceContainer}>
            <SearchBar
              containerStyle = {styles.searchContainer}
              inputContainerStyle = {{backgroundColor:"#D4D3FF"}}
              inputStyle = {{color:'#FFFFFF', fontSize:14}}
              placeholderTextColor = '#FFFFFF'
              placeholder = "Ask a question or search for a topic..."
              onChangeText={this.onChangeText}
              onClearText={this.onClearText}
              value={search}
            />
              {articles}
          </View>
          );
    }
  }
}


const styles = StyleSheet.create({

  container: {
    paddingTop: 15,
    alignItems:'center',
  },

  resourceContainer:{
    justifyContent:'center',
    paddingLeft:width*.075,
    marginTop:height*.02,
  },

  searchContainer:{
    borderRadius:50,
    backgroundColor:"#D4D3FF",
    marginLeft:20,
    marginRight:20,
    height: height * .07,
    width: width*.8,
    justifyContent:'center',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  articleContainer:{
    borderRadius: 15,
    width: width *.85,
    height: height *.15,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor:'#7B80FF',
  },
  buttonText:{
    textAlign:'center',
    ...textStyle.subheader,
    fontSize:16,
    color:"#FFFFFF",
  },
});
