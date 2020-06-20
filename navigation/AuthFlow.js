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
} from 'react-native';
import NextButton from '../components/NextButton';
import CustomTextInput from '../components/CustomTextInput';
import theme from '../styles/theme.style.js';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {textStyle} from '../styles/text.style.js';
import ReferencePopUp from '../components/ReferencePopUp.js';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import host from '../constants/Server.js';


class LandingScreen extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: 140 }}>
          <Text style={textStyle.title}>fondu</Text>
        </View>
        <View style={styles.contentContainer}>
          <NextButton title="Sign In"
                onPress={() => this.props.navigation.navigate('SignIn')}
                buttonStyle = {{marginBottom:28, backgroundColor: theme.PRIMARY_COLOR}}/>
          <NextButton title="Sign Up"
                onPress={() => this.props.navigation.navigate('SignUp')}
                buttonStyle = {{marginBottom:10, backgroundColor: theme.PRIMARY_COLOR}}/>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity><Text style={styles.footerStyle}>Forgot password?</Text></TouchableOpacity>
        </View>
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

    const { email, password } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {textStyle.header3}>Welcome back!</Text>
        </View>
        <View style={styles.contentContainer}>
          <Input
            containerStyle={{marginBottom: 10}}
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
                buttonStyle={{
                  marginBottom:10,
                  backgroundColor: theme.PRIMARY_COLOR,
                }}
                disabled={email === '' || password === ''}
          />
        </View>
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', width: '60%', justifyContent:'space-between'}}>

       <TouchableOpacity><Text style={styles.footerStyle}>Forgot password?</Text></TouchableOpacity>
       <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignUp')}><Text style={styles.footerStyle}>Sign Up</Text></TouchableOpacity>

      </View>
        </View>

      </View>
    );
  }

  _signInAsync = async () => {

    const { email, password } = this.state;
    const emailLowerCase = email.toLowerCase();
    let data={"email": emailLowerCase,
      "password": password};

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
      badName: false,
      badEmail: false,
      badPassword: false,
      badConfirmPass: false,
    };
    this.goToSettingsScreen=this.goToSettingsScreen.bind(this);

  }

  checkForValidRegInput(name, email, password, password2){
    // check if name is valid
    const validName = name.length > 0;
    this.setState({ badName: !validName });

    //check is email is valid
    const validator = require("email-validator");
    let validEmail = validator.validate(email); // true
    if(!validEmail){
      this.setState({badEmail:true});
    }else{
      this.setState({badEmail:false});
    }
    
    // check if password is secure
    const securePassword = /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(password);
    this.setState({ badPassword: !securePassword });

    //check is password is valid
    let validPassword = (password === password2);
    if(!validPassword){
      this.setState({badConfirmPass:true});
    }else{
      this.setState({badConfirmPass:false});
    }

    return validName && validEmail && securePassword && validPassword;

  }

  goToSettingsScreen(){
    const {
      name,
      email,
      password,
      password2,
    } = this.state;
    const emailLowerCase = email.toLowerCase();
    const validInputs = this.checkForValidRegInput(name, emailLowerCase, password, password2);

    if(validInputs){
      this.props.navigation.navigate('RelationshipStatus', {
        email: emailLowerCase,
        password,
      });
    }

  }

  render() {
    const {
      name,
      email,
      password,
      password2,
      badName,
      badEmail,
      badPassword,
      badConfirmPass,
    } = this.state;
    // only show the first error
    let nameError = false;
    let emailError = false;
    let passwordError = false;
    let confirmPassError = false;
    if (badName) {
      nameError = true;
    } else {
      if (badEmail) {
        emailError = true;
      } else {
        if (badPassword) {
          passwordError = true;
        } else {
          if (badConfirmPass) {
            confirmPassError = true;
          }
        }
      }
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {textStyle.header3}>Create Account</Text>
        </View>
        <View style={styles.contentContainer}>
          <Input
            containerStyle={{marginBottom: 10}}
            errorStyle={{ color: 'red' }}
            errorMessage={nameError ? 'Please enter a name' : ''}
            label='NAME'
            labelStyle={styles.labelStyle}
            inputStyle={{color:'white'}}
            inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
            onChangeText={text => this.setState({name: text})}
          />
          <Input
            containerStyle={{marginBottom: 10}}
            errorStyle={{ color: 'red' }}
            errorMessage={emailError ? 'Please enter a valid email' : ''}
            label='EMAIL'
            labelStyle={styles.labelStyle}
            inputStyle={{color:'white'}}
            inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
            onChangeText={text => this.setState({email: text})}
          />
          <Input
            containerStyle={{marginBottom: 10}}
            errorStyle={{ color: 'red' }}
            errorMessage={passwordError ? 'Must contain at least 8 characters, uppercase and lowercase letters, a digit, and a symbol' : ''}
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
            errorMessage={confirmPassError ? 'Passwords do not match' : ''}
            label='CONFIRM PASSWORD'
            labelStyle={styles.labelStyle}
            inputStyle={{color:'white'}}
            inputContainerStyle={{borderColor:'rgba(255, 255, 255, 0.5)'}}
            onChangeText={text => this.setState({password2: text})}
            secureTextEntry={true}
          />
          <NextButton title="Sign Up" onPress={this.goToSettingsScreen}
            buttonStyle={{
              backgroundColor: theme.PRIMARY_COLOR,
              marginBottom: 10,
            }}
            disabled={name === '' || email === '' || password === '' || password2 === ''}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignIn')}><Text style={styles.footerStyle}>Sign in</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

class RelationshipStatusScreen extends React.Component {
  static navigationOptions = {
  	headerTransparent: true,
  	headerTintColor:'white',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
    };
    this.getRelationshipStatus = this.getRelationshipStatus.bind(this);
  }

  getRelationshipStatus() {
    const { selectedIndex } = this.state;
    switch (selectedIndex) {
      case 0: return 0;
      case 1:
      case 2: return 1;
      default: return -1;
    }
  }

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam('email', null);
    const password = navigation.getParam('password', null);
    const { selectedIndex } = this.state;
    const onPressRelationshipStatus = (selectedIndex) => {
      this.setState({ selectedIndex });
    };
    const onPressNext = () => {
      const relationshipStatus = this.getRelationshipStatus();
      this.props.navigation.navigate('WeeklyGoal', {
        email,
        password,
        relationshipStatus,
      });
    };
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {textStyle.header3}>Let's Get Started </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={{ ...textStyle.subheader, color: theme.TEXT_COLOR_2 }}>
            What is your relationship status?
          </Text>
          <Text style={{ ...textStyle.footer, color: theme.TEXT_COLOR_2 , opacity: 0.5 }}>
            This information can be changed later
          </Text>
          <StyledButtonGroup
            onPress={onPressRelationshipStatus}
            selectedIndex={selectedIndex}
            buttons={['Single', 'In a relationship', 'Other']}
          />
          <NextButton
            title="Next"
            onPress={onPressNext}
            buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR, marginBottom: 10}}
            disabled={selectedIndex < 0}
          />
        </View>
        <View style={styles.footer}/>
      </View>
    );
  }
}

class WeeklyGoalScreen extends React.Component {
  static navigationOptions = {
  	headerTransparent: true,
  	headerTintColor:'white',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      showHelp: false,
    };
    this.getInterval = this.getInterval.bind(this);
  }

  getInterval() {
    const { selectedIndex } = this.state;
    switch (selectedIndex) {
      case 0: return 3;
      case 1: return 2;
      case 2: return 1;
      default: return -1;
    }
  }

  render() {
    const { selectedIndex, showHelp } = this.state;
    const onPressWeeklyGoal = (selectedIndex) => {
      this.setState({ selectedIndex });
    };
    const onPressHelp = () => {
      this.setState({ showHelp: true });
    };
    const hideHelp = () => {
      this.setState({ showHelp: false });
    };
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {textStyle.header3}>Let's Get Started </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...textStyle.subheader, color: theme.TEXT_COLOR_2, marginRight: 5 }}>
              What is your weekly goal? 
            </Text>
            <TouchableOpacity onPress={onPressHelp}>
              <Icon name="help-outline" color={theme.TEXT_COLOR_2} size={20}/>
            </TouchableOpacity>
          </View>
          <ReferencePopUp
            showRef={showHelp}
            refs={[]}
            content={(
              <View margin={20}>
                <Text style={{ ...textStyle.subheader, marginBottom: 10 }}>
                  What does the weekly goal mean?
                </Text>
                <Text style={{ ...textStyle.caption, color: theme.TEXT_COLOR_2 }}>
                  This is the number of lessons we will be giving you per week. Each of our lessons will take around 5 minutes to complete and will teach you about different aspects of a healthy relationship!
                </Text>
              </View>
            )}
            hide={hideHelp}
          />
          <Text style={{ ...textStyle.footer, color: theme.TEXT_COLOR_2, opacity: 0.5}}>
            This information can be changed later
          </Text>
          <StyledButtonGroup
            onPress={onPressWeeklyGoal}
            selectedIndex={selectedIndex}
            buttons={[
              { left: 'casual', right: '2x/week' },
              { left: 'regular', right: '3x/week' },
              { left: 'serious', right: '4x/week' },
            ]}
          />
          <NextButton
            title="Next"
            onPress={this._signUpAsync}
            buttonStyle = {{backgroundColor: theme.PRIMARY_COLOR, marginBottom: 10}}
            disabled={selectedIndex < 0}
          />
        </View>
        <View style={styles.footer}/>
      </View>
    );
  }

  _signUpAsync = async () => {
    const { navigation } = this.props;
    const email = navigation.getParam('email', null);
    const password = navigation.getParam('password', null);
    const relationshipStatus = navigation.getParam('relationshipStatus', null);

    const interval = this.getInterval();
    let data={"email": email,
          "password": password,
          "relationshipStatus": relationshipStatus,
          "interval": interval};

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
  header:{
    flexGrow: 1,
    marginTop: 120,
  },
  contentContainer: {
    alignSelf: 'stretch',
  },
  footer: {
    alignSelf: 'center',
    height: 100,
  },
  footerStyle: {
    fontWeight: '700',
    fontSize: 12,
    color: theme.TEXT_COLOR_2,
  },
  labelStyle: {
    color: 'rgba(255,255,255, 0.5)',
    ...textStyle.caption,
  },
});

const StyledButtonGroup = ({ onPress, selectedIndex, buttons }) => {
  const textStyle = {
    fontSize: 14,
    color: theme.TEXT_COLOR_2,
    fontFamily: 'poppins-bold',
    textTransform: 'uppercase',
  };
  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.SECONDARY_COLOR,
        borderRadius: 25,
        paddingHorizontal: '15%',
        paddingVertical: '5%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        width: '130%',
        marginTop: '5%',
        marginBottom: '20%',
      }}
    >
      {buttons.map((button, i) => (
        <View
          key={i}
          style={{
            height: 40,
            alignItems: 'center',
            borderColor: theme.TRANSLUCENT_GRAY,
            ...(i !== buttons.length - 1 ? { borderBottomWidth: 1 } : []),
          }}
        >
          <TouchableOpacity
            onPress={() => onPress(i)}
            style={{
              flex: 1,
              justifyContent: 'center',
              borderRadius: 20,
              width: '115%',
              paddingHorizontal: '7%',
              backgroundColor: 'transparent',
              ...(selectedIndex === i ? {
                backgroundColor: 'white',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              } : []),
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={textStyle}>
                {button.left ? button.left : button}
              </Text>
              {button.right && (
                <Text style={{
                  flex: 1,
                  textAlign: 'right',
                  ...textStyle,
                }}>
                  {button.right}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

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
          RelationshipStatus: RelationshipStatusScreen,
          WeeklyGoal: WeeklyGoalScreen,
				});

export default AuthStack;
