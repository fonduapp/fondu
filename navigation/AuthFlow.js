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
import { _getAuthTokenUserId } from '../constants/Helper.js'


class LandingScreen extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: 140 }}>
          <Text style={{ ...textStyle.title, color: 'white' }}>fondu</Text>
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
          <Text style = {styles.headerText}>Welcome back!</Text>
        </View>
        <View style={styles.contentContainer}>
          <StyledInput
            label='EMAIL'
            onChangeText={text => this.setState({email: text})}
          />
          <StyledInput
            containerStyle={{marginBottom: 20}}
            label='PASSWORD'
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
            <View style={{ flexDirection: 'row', width: '100%', justifyContent:'space-between' }}>
             <TouchableOpacity><Text style={styles.signInFooterStyle}>Forgot password?</Text></TouchableOpacity>
             <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignUp')}><Text style={styles.signInFooterStyle}>Sign Up</Text></TouchableOpacity>
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
    this.isInputValid = this.isInputValid.bind(this);
    this.onEndEditingName = this.onEndEditingName.bind(this);
    this.onEndEditingEmail = this.onEndEditingEmail.bind(this);
    this.onEndEditingPassword = this.onEndEditingPassword.bind(this);
    this.onEndEditingConfirmPass = this.onEndEditingConfirmPass.bind(this);
  }

  isNameValid(name) {
    return name.length > 0;
  }

  isEmailValid(email) {
    const validator = require('email-validator');
    return validator.validate(email);
  }

  isPasswordValid(password) {
    return /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(password);
  }

  isConfirmPassValid(password, password2) {
    return password === password2;
  }

  isInputValid(){
    const {
  	  name,
      email,
      password,
      password2,
    } = this.state;
    return (
      this.isNameValid(name)
      && this.isEmailValid(email)
      && this.isPasswordValid(password)
      && this.isConfirmPassValid(password, password2)
    );
  }

  onEndEditingName(event) {
    const { nativeEvent: { text: name }} = event;
    this.setState({ badName: !this.isNameValid(name) });
  }

  onEndEditingEmail(event) {
    const { nativeEvent: { text: email }} = event;
    this.setState({ badEmail: !this.isEmailValid(email) });
  }

  onEndEditingPassword(event) {
    const { nativeEvent: { text: password }} = event;
    this.setState({ badPassword: !this.isPasswordValid(password) });
    const { password2 } = this.state;
    if (password2 !== '') {
      this.setState({ badConfirmPass: !this.isConfirmPassValid(password, password2) });
    }
  }

  onEndEditingConfirmPass(event) {
    const { nativeEvent: { text: confirmPass }} = event;
    const { password } = this.state;
    this.setState({ badConfirmPass: !this.isConfirmPassValid(password, confirmPass) });
  }

  _signUpAsync = async () => {
    const { email, password } = this.state;
    const emailLowerCase = email.toLowerCase();

    let data = {
      "email": emailLowerCase,
      "password": password,
    };

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
      this.props.navigation.navigate('RelationshipStatus');
    })
    .catch((error) => {
      console.error(error);
    });

  };

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
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {styles.headerText}>Create Account</Text>
        </View>
        <View style={styles.contentContainer}>
          <StyledInput
            errorMessage={badName ? 'Please enter a name' : ''}
            label='NAME'
            onChangeText={text => this.setState({name: text})}
            onEndEditing={this.onEndEditingName}
          />
          <StyledInput
            errorMessage={badEmail ? 'Please enter a valid email' : ''}
            label='EMAIL'
            onChangeText={text => this.setState({email: text})}
            onEndEditing={this.onEndEditingEmail}
          />
          <StyledInput
            errorMessage={badPassword ? 'Must contain at least 8 characters, uppercase and lowercase letters, a digit, and a symbol' : ''}
            label='PASSWORD'
            onChangeText={text => this.setState({password: text})}
            secureTextEntry={true}
            onEndEditing={this.onEndEditingPassword}
          />
          <StyledInput
            containerStyle={{marginBottom: 20}}
            errorMessage={badConfirmPass ? 'Passwords do not match' : ''}
            label='CONFIRM PASSWORD'
            onChangeText={text => this.setState({password2: text})}
            secureTextEntry={true}
            onEndEditing={this.onEndEditingConfirmPass}
          />
          <NextButton title="Sign Up" onPress={this._signUpAsync}
            buttonStyle={{
              backgroundColor: theme.PRIMARY_COLOR,
              marginBottom: 10,
            }}
            disabled={!this.isInputValid()}
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
      case 0: return 1;
      case 1:
      case 2: return 2;
      default: return 0;
    }
  }

  _relationshipStatusAsync = async () => {
    const relationshipStatus = this.getRelationshipStatus();
    const { authToken, userId } = await _getAuthTokenUserId();

    let data = {
      "userId": userId,
      "authToken": authToken,
      "relationshipStatus": relationshipStatus,
    };

    //replace with your ip address
    return fetch('http://' + host + ':3000/updateRelationshipStatus',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .catch((error) => {
      console.error(error);
    });
  };

  render() {
    const { selectedIndex } = this.state;
    const onPressRelationshipStatus = (selectedIndex) => {
      this.setState({ selectedIndex });
    };
    const onPressNext = () => {
      this._relationshipStatusAsync();
      this.props.navigation.navigate('WeeklyGoal');
    };
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {styles.headerText}>Let's Get Started </Text>
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
      case 0: return 1;
      case 1: return 2;
      case 2: return 3;
      default: return 0;
    }
  }

  _intervalAsync = async () => {
    const interval = this.getInterval();
    const { authToken, userId } = await _getAuthTokenUserId();

    let data = {
      "userId": userId,
      "authToken": authToken,
      "interval": interval,
    };

    //replace with your ip address
    return fetch('http://' + host + ':3000/updateInterval',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .catch((error) => {
      console.error(error);
    });
  };

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
    const onPressNext = () => {
      this._intervalAsync();
      this.props.navigation.navigate('Main');
    };
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style = {styles.headerText}>Let's Get Started </Text>
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
              { left: 'casual', right: '1x/week' },
              { left: 'regular', right: '2x/week' },
              { left: 'serious', right: '3x/week' },
            ]}
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
    alignItems: 'center',
    height: 100,
    width: '100%',
  },
  signInFooterStyle: {
    ...textStyle.label,
    color: theme.TEXT_COLOR_2,
  },
  footerStyle: {
    ...textStyle.label,
    color: 'white',
  },
  headerText: {
    ...textStyle.header3,
    color: 'white',
  },
});

const StyledInput = (props) => (
  <Input 
    containerStyle={{ marginBottom: 10 }}
    errorStyle={{
      ...textStyle.label,
      color: 'red',
    }}
    labelStyle={{
      color: 'rgba(255,255,255, 0.5)',
      ...textStyle.caption,
    }}
    inputStyle={{
      ...textStyle.label,
      color: 'white',
    }}
    inputContainerStyle={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
    selectionColor={theme.PRIMARY_COLOR}
    { ...props }
  />
);

const StyledButtonGroup = ({ onPress, selectedIndex, buttons }) => {
  const textStyle = (index) => ({
    fontSize: 14,
    color: theme.TEXT_COLOR_2,
    fontFamily: 'poppins-bold',
    textTransform: 'uppercase',
    opacity: selectedIndex < 0 || selectedIndex === index ? 1.0 : 0.5,
  });
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
              <Text style={textStyle(i)}>
                {button.left ? button.left : button}
              </Text>
              {button.right && (
                <Text style={{
                  flex: 1,
                  textAlign: 'right',
                  ...textStyle(i),
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
