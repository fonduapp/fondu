import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator } from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import { ExpoLinksView } from '@expo/samples';
import { createStackNavigator } from 'react-navigation-stack';

const screenWidth =  Dimensions.get('window').width;
const screenHeight =  Dimensions.get('window').height;

export default class SubtopicScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      search:'',
      isLoading: true,
      subList:[
        {
          area_name: 'subsection 1',
          area_id:'0'
        },
        {
          area_name: 'subsection 2',
          area_id:'1'
        },
        {
          area_name: 'subsection 3',
          area_id:'2'
        },
      ]
    }
  }

  updateSeach = search =>{
    this.setState({search});
  };

/*
  componentDidMount(){
    console.log('hi')
    return fetch('http://localhost:3000/allAreas/8/abcdefg')
      .then((response)=>response.json())
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
  */
  render(){
    const { search } = this.state;

    /*
    if (this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    } else {
        let articles = this.state.articleList.map((article,i)=>{
            return <View key = {i}>
                    <Text>{article.area_name}</Text>
                  </View>
            });

      let articles = this.state.articleList.map((article,i)=>{
          return <View key = {i} style = {styles.articleContainer}>
                  <Text>{article.area_name}</Text>
                </View>
              });
              */
        let articles = this.state.subList.map((article,i)=>{
            return <TouchableOpacity
                  key = {i}
                  style = {styles.articleContainer}
                  onPress={()=> this.props.navigation.navigate('Article')}>
                    <Text style = {styles.buttonText}>
                        {article.area_name}
                    </Text>
                  </TouchableOpacity>
                });
        return(
          <View>
          <SearchBar
            containerStyle = {styles.searchContainer}
            inputContainerStyle = {{backgroundColor:"#D4D3FF"}}
            inputStyle = {{color:'#FFFFFF', fontSize:14}}
            placeholderTextColor = '#FFFFFF'
            placeholder = "Ask a question or search for a topic..."
            onChangeText={this.updateSeach}
            value = {search}
          />
          <View style = {styles.container}>
            {articles}
        </View>
        </View>
      );
    }
  }

SubtopicScreen.navigationOptions = {
  title: 'Subtopics',
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection:'row',
    flexWrap: 'wrap',
    paddingTop: 15,
    justifyContent:"flex-start",
    backgroundColor: '#fff',
  },
  searchContainer:{
    borderRadius:50,
    backgroundColor:"#D4D3FF",
    marginLeft:20,
    marginRight:20,
    height: screenHeight * .05,
    justifyContent:'center',

  },
  articleContainer:{
    borderRadius: 15,
    width: screenWidth *.40,
    height: screenWidth *.40,
    justifyContent: 'center',
    marginTop: 20,
    marginLeft:(screenWidth * .20)/3,
    backgroundColor:'#7B80FF',
  },
  buttonText:{
    textAlign:'center',
    fontSize: 16,
    fontWeight: 'bold',
    color:"#FFFFFF",
  },
});
