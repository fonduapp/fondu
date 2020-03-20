import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  TouchableOpacity,
  TextInput,
  Picker
} from 'react-native';
import NextButton from '../components/NextButton';
import CustomTextInput from '../components/CustomTextInput';
import theme from '../styles/theme.style.js';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


class LandingScreen extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
      	<Text style={styles.title}>fondu</Text>
        <NextButton title="Sign In" 
        			onPress={() => this.props.navigation.navigate('SignIn')} 
        			buttonStyle = {{marginBottom:28, backgroundColor: theme.PRIMARY_COLOR}}/>
        <NextButton title="Sign Up" 
        			onPress={() => this.props.navigation.navigate('SignUp')}
        			buttonStyle = {{marginBottom:10, backgroundColor: theme.PRIMARY_COLOR}}/>
        <TouchableOpacity><Text style = {{color:'white'}}>Forgot password?</Text></TouchableOpacity>
      </View>
    );
  }
}

class SignInScreen extends React.Component {
  static navigationOptions = {
  	headerTransparent: true,
  	headerTintColor:'white',
  };

  constructor(props){
  	super(props);
  	this.state = {
      email: '',
      password: '',
    };
  }


  render() {

    return (
      <View style={styles.container}>
      	<Text style = {styles.header}>Welcome back!</Text>
      	<CustomTextInput title = "Email"
      					 onChangeText={text => this.setState({email: text})}
      					 value={this.state.email}/>
      	<CustomTextInput title = "Password"
      					 onChangeText={text => this.setState({password: text})}
      					 value={this.state.password}/>

        <NextButton title="Sign In" onPress={this._signInAsync}
        			buttonStyle = {{marginBottom:10, backgroundColor: theme.PRIMARY_COLOR}}/>
        <View style={{flexDirection: 'row', width: '60%', justifyContent:'space-between'}}>

		 <TouchableOpacity><Text style={{fontWeight: '700', fontSize: 12, color: 'gray'}}>Forgot password?</Text></TouchableOpacity>
		 <TouchableOpacity><Text style={{fontWeight: '700', fontSize: 12, color: 'gray'}}>Sign Up</Text></TouchableOpacity>

		</View>

      </View>
    );
  }

  _signInAsync = async () => {

    let data={"email": this.state.email,
      "password": this.state.password};

    //replace with your ip address
    return fetch('http://192.168.2.194:3000/login',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      // AsyncStorage.setItem('authToken', responseJson.authToken);
      // AsyncStorage.setItem('userId', responseJson.userId.toString());
      this.props.navigation.navigate('Main');
    })
    .catch((error) => {
      console.error(error);
    });

    
  };
}

class SignUpScreen extends React.Component {
  static navigationOptions = {
  	headerTransparent: true,
  	headerTintColor:'white',
  };

  constructor(props){
  	super(props);
  	this.state = {
  	  name: '',
      email: '',
      password: '',
      password2:'',
      relationshipStatus: 0,
      interval: 3,
      screen: 0, //first or second screen of sign up
    };
  }

  render() {
    return (
      <>
      { this.state.screen==0 ? 
      <View style={styles.container}>
      	<Text style = {[styles.header,{marginBottom: '20%'}]}>Create Account</Text>
      	<CustomTextInput title = "Name"
      					 onChangeText={text => this.setState({name: text})}
      					 value={this.state.name}/>
      	<CustomTextInput title = "Email"
      					 onChangeText={text => this.setState({email: text})}
      					 value={this.state.email}/>
      	<CustomTextInput title = "Password"
      					 onChangeText={text => this.setState({password: text})}
      					 value={this.state.password}/>
      	<CustomTextInput title = "Confirm password"
      					 onChangeText={text => this.setState({password2: text})}
      					 value={this.state.password2}/>

        <NextButton title="Sign Up" onPress={()=>this.setState({screen: 1})} buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR, marginBottom: 10}}/>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignIn')}><Text>Sign in</Text></TouchableOpacity>
      </View>
      :
      <View style={styles.container}>
        <Text style = {styles.header}>Let's Get Started </Text>
        <View style = {{width:'60%'}}>
          <Text>What is your relationship status?</Text>
          <Picker
        selectedValue={this.state.language}
        style={{height: 50}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({relationshipStatus: itemValue})
        }
        mode= 'dropdown'
        >
        <Picker.Item label="Single" value={0} />
        <Picker.Item label="In a relationship" value={1} />
      </Picker>
          <Text>What is your weekly goal?</Text>
          <Picker
        selectedValue={this.state.language}
        style={{height: 50}}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({interval: itemValue})
        }
        mode= 'dropdown'
        >
        <Picker.Item label="Casual" value={3} />
        <Picker.Item label="Regular" value={2}/>
        <Picker.Item label="Serious" value={1} />
        </Picker>
        </View>
        <NextButton title="Next" onPress={this._signUpAsync} buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR}}/>
      </View>
    }
    </>
    );
  }

  _signUpAsync = async () => {

    let data={"email": this.state.name,
          "password": this.state.password,
          "relationshipStatus": this.state.relationshipStatus,
          "interval": this.state.interval};

    //replace with your ip address
    return fetch('http://192.168.2.194:3000/signup',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      AsyncStorage.setItem('authToken', responseJson.authToken);
      AsyncStorage.setItem('userId', responseJson.userId.toString());
    })
    .catch((error) => {
      console.error(error);
    });

  };
}

class InitialSettingsScreen extends React.Component {
  static navigationOptions = {
    headerTransparent: true,
    headerTintColor:'white',
  };

  constructor(props){
  	super(props);
  	this.state = {
  	  relationshipStatus: '',
      interval: 0,
    };
  }

  render() {
    return (
      <View style={styles.container}>
      	<Text style = {styles.header}>Let's Get Started </Text>
      	<View style = {{width:'60%'}}>
	      	<Text>What is your relationship status?</Text>
	      	<Picker
			  selectedValue={this.state.language}
			  style={{height: 50}}
			  onValueChange={(itemValue, itemIndex) =>
			    this.setState({relationshipStatus: itemValue})
			  }
			  mode= 'dropdown'
			  >
			  <Picker.Item label="Single" value="single" />
			  <Picker.Item label="In a relationship" value="relationship" />
			</Picker>
	      	<Text>What is your weekly goal?</Text>
	      	<Picker
			  selectedValue={this.state.language}
			  style={{height: 50}}
			  onValueChange={(itemValue, itemIndex) =>
			    this.setState({interval: itemValue})
			  }
			  mode= 'dropdown'
			  >
			  <Picker.Item label="Casual" value={3} />
			  <Picker.Item label="Regular" value={2}/>
			  <Picker.Item label="Serious" value={1} />
			</Picker>
		  </View>
        <NextButton title="Next" onPress={this._signUpAsync} buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR}}/>
      </View>
    );
  }

  _signUpAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('Main');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.PRIMARY_COLOR_7,
  },
  title: {
  	fontSize: 36,
  	padding: 150,
  	color: 'white',
  },
  header: {
  	fontSize:36, 
  	fontWeight: 'bold', 
  	color:'white', 
  	width:'60%', 
  	marginBottom: '40%'
  },
});

// const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ 
					Landing: {
				      screen: LandingScreen,
				      navigationOptions: {
				        header: null,
				      },
				    },
					SignIn: SignInScreen,
					SignUp: SignUpScreen,
					InitialSettings: InitialSettingsScreen,


				});

export default AuthStack;
