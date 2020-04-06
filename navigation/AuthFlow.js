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
  Picker,
  KeyboardAvoidingView
} from 'react-native';
import NextButton from '../components/NextButton';
import CustomTextInput from '../components/CustomTextInput';
import theme from '../styles/theme.style.js';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {textStyle} from '../styles/text.style.js';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import host from '../constants/Server.js';


class LandingScreen extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
      	<Text style={[textStyle.title, styles.headerSpace]}>fondu</Text>
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
      <KeyboardAvoidingView style={styles.container} behavior="padding">
      	<Text style = {[textStyle.header, styles.headerSpace]}>Welcome back!</Text>
        <Input
          containerStyle={{marginBottom: 10}}
          errorStyle={{ color: 'red' }}
          errorMessage={this.state.badEmail ? 'Please enter a valid email' : ''}
          label='EMAIL'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({email: text})}
        />
        <Input
          containerStyle={{marginBottom: 20}}
          label='PASSWORD'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({password: text})}
          secureTextEntry={true}
        />
        <NextButton title="Sign In" onPress={this._signInAsync}
        			buttonStyle = {{marginBottom:10, backgroundColor: theme.PRIMARY_COLOR}}/>
        <View style={{flexDirection: 'row', width: '60%', justifyContent:'space-between'}}>

		 <TouchableOpacity><Text style={{fontWeight: '700', fontSize: 12, color: 'gray'}}>Forgot password?</Text></TouchableOpacity>
		 <TouchableOpacity><Text style={{fontWeight: '700', fontSize: 12, color: 'gray'}}>Sign Up</Text></TouchableOpacity>

		</View>

      </KeyboardAvoidingView>
    );
  }

  _signInAsync = async () => {

    let data={"email": this.state.email,
      "password": this.state.password};

    //replace with your ip address
    return fetch('http://' + host + ':3000/login',{
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
      badEmail: false,
      badPassword: false,
      badConfirmPass: false,
    };
    this.goToSettingsScreen=this.goToSettingsScreen.bind(this);

  }

  checkForValidRegInput(email, password, password2){
    //check is email is valid
    var validator = require("email-validator");
    let validEmail = validator.validate(email); // true
    if(!validEmail){
      this.setState({badEmail:true});
    }else{
      this.setState({badEmail:false});
    }

    //check is password is valid and secure
    let validPassword = (password === password2);
    if(!validPassword){
      this.setState({badConfirmPass:true});
    }else{
      this.setState({badConfirmPass:false});
    }
    //TODO: secure password check

    return validEmail && validPassword;

  }

  goToSettingsScreen(){
    let validInputs = this.checkForValidRegInput(this.state.email, this.state.password, this.state.password2);

    if(validInputs){
      this.setState({screen: 1})
    }

  }

  render() {
    return (
      <>
      { this.state.screen==0 ? 
      <KeyboardAvoidingView style={styles.container} behavior="padding">
      	<Text style = {[textStyle.header, styles.headerSpace, {marginBottom: '20%'}]}>Create Account</Text>
        <Input
          containerStyle={{marginBottom: 10}}
          label='NAME'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({name: text})}

        />
        <Input
          containerStyle={{marginBottom: 10}}
          errorStyle={{ color: 'red' }}
          errorMessage={this.state.badEmail ? 'Please enter a valid email' : ''}
          label='EMAIL'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({email: text})}
        />
        <Input
          containerStyle={{marginBottom: 10}}
          label='PASSWORD'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({password: text})}
          secureTextEntry={true}
        />
        <Input
          containerStyle={{marginBottom: 20}}
          errorStyle={{ color: 'red' }}
          errorMessage={this.state.badConfirmPass ? 'Passwords do not match' : ''}
          label='CONFIRM PASSWORD'
          labelStyle={styles.labelStyle}
          inputStyle={{color:'white'}}
          inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
          onChangeText={text => this.setState({password2: text})}
          secureTextEntry={true}
        />

        <NextButton title="Sign Up" onPress={this.goToSettingsScreen} buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR, marginBottom: 10}}/>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignIn')}><Text style={{color:'rgba(255,255,255,0.8)', }}>Sign in</Text></TouchableOpacity>
      </KeyboardAvoidingView>
      :
      <View style={styles.container}>
        <Text style = {[textstyle.header, styles.headerSpace]}>Let's Get Started </Text>
        <View>
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
        <Picker.Item label="Casual (Every 3 days)" value={3} />
        <Picker.Item label="Regular (Every 2 days)" value={2}/>
        <Picker.Item label="Serious (Every day)" value={1} />
        </Picker>
        </View>
        <NextButton title="Next" onPress={this._signUpAsync} buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR}}/>
      </View>
    }
    </>
    );
  }

  _signUpAsync = async () => {

    let data={"email": this.state.email,
          "password": this.state.password,
          "relationshipStatus": this.state.relationshipStatus,
          "interval": this.state.interval};

    //replace with your ip address
    return fetch('http://' + host + ':3000/signup',{
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
      this.props.navigation.navigate('Main');
    })
    .catch((error) => {
      console.error(error);
    });

  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.PRIMARY_COLOR_7,
    paddingLeft: '20%',
    paddingRight: '20%',
  },
  labelStyle: {
    color: 'rgba(255,255,255, 0.5)',
    fontSize: 13,
  },
  headerSpace:{
    marginBottom: '40%'
  }
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


				});

export default AuthStack;
