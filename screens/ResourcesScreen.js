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
import theme from '../styles/theme.style.js';
import { ExpoLinksView } from '@expo/samples';
import { createStackNavigator } from 'react-navigation-stack';

const screenWidth =  Dimensions.get('window').width;
const screenHeight =  Dimensions.get('window').height;

export default class ResourcesScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      search:'',
      isLoading: true,
      articleList: [],
    }
  }
  updateSeach = search =>{
    this.setState({search});
  };

  componentDidMount(){
    return fetch('http://192.168.2.194:3000/allAreas/8/abcdefg')
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

  render(){

    const { search } = this.state;
    console.log(this.state.isLoading)
    if (this.state.isLoading){

      return(
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    } else {
      //console.log(this.state.articleList)
        let articles = this.state.articleList.map((article,i)=>{
            return <TouchableOpacity
                  key = {i}
                  style = {styles.articleContainer}
                  onPress={()=> this.props.navigation.navigate('Subtopics')}>
                    <Text style = {styles.buttonText}>
                        {article.area_text}
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
}

ResourcesScreen.navigationOptions = {
  title: 'Resources',
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 15,
    alignItems:'center',
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
    width: screenWidth *.85,
    height: screenHeight *.15,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor:'#7B80FF',
  },
  buttonText:{
    textAlign:'center',
    fontSize: 16,
    fontWeight: 'bold',
    color:"#FFFFFF",
  },
});
