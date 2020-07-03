import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon } from 'react-native-elements';
import ProgressBar from '../components/ProgressBar';
import PopUp from '../components/PopUp.js';
import { textStyle } from '../styles/text.style.js';

export default class ProgressNavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPopUp: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    const { navigation } = this.props;
    if (navigation.isFocused()) {
      this.onPress();
      return true;
    } else {
      // do nothing
      return false;
    }
  }

  onPress = () => {
    const { confirmAction = false } = this.props;
    if (confirmAction) {
      this.setState({ showPopUp: true });
    } else {
      this.exit();
    }
  };

  exit = () => {
    this.props.navigation.goBack();
  };

  hidePopUp = () => {
    this.setState({ showPopUp: false });
  };

	render() {
    const { showPopUp } = this.state;
		return (
      <>
        <View style = {{}}>
          { this.props.title != null ?
              <View style={{flex: 1, padding: 25, position:'absolute', top:0, left: 0, right: 0}}>
                <Text style={[styles.titleText,{color: this.props.color==null ? 'white': this.props.color}]}> {this.props.title} </Text>
              </View>
              : null
          }
          <View style = {{ flexDirection: 'row', padding: 25, alignItems: 'center'}}>
            <TouchableOpacity onPress={this.onPress} style={{marginRight: 20}}>
              <Icon name='close' color= {this.props.color==null ? 'white': this.props.color} size={40}/>
            </TouchableOpacity>
            
            { this.props.progress != null ?
              <ProgressBar color= {this.props.color==null ? 'white': this.props.color}
                           progress = {this.props.progress}
              />
              : null
            }
          </View>

        </View>
        <PopUp isVisible={showPopUp} hide={this.hidePopUp}>
          <View style={styles.popUpContainer}>
            <Text style={styles.popUpText}>
              The quiz will restart if you exit
            </Text>
            <TouchableOpacity onPress={this.exit}>
              <Text style={styles.popUpButtonText}>
                Exit
              </Text>
            </TouchableOpacity>
            <View style={styles.popUpButtonDivider}/>
            <TouchableOpacity onPress={this.hidePopUp}>
              <Text style={styles.popUpButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </PopUp>
      </>
		);
	}
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popUpContainer: {
    alignItems: 'center',
  },
  popUpText: {
    ...textStyle.subheader,
    color: theme.TEXT_COLOR,
    opacity: 0.5,
    marginBottom: 10,
  },
  popUpButtonText: {
    ...textStyle.header4,
    color: theme.TEXT_COLOR,
    marginVertical: 8,
  },
  popUpButtonDivider: {
    borderBottomColor: theme.TEXT_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    opacity: 0.2,
  },
});
