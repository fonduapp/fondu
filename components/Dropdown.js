import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { textStyle } from '../styles/text.style.js';
import theme from '../styles/theme.style.js';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animHeight = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {
    const {
      isOpen,
      container,
      onAnimationEnd,
    } = this.props;
    const { maxHeight } = this.state;
    if (isOpen === prevProps.isOpen) {
      // do nothing
      return;
    }
    const minHeight = 0;
    const startHeight = isOpen ? minHeight : maxHeight;
    this.animHeight.setValue(startHeight);
    const endHeight = isOpen ? maxHeight : minHeight;
    Animated.timing(
      this.animHeight,
      {
        toValue: endHeight,
      },
    ).start(() => {
      if (isOpen) {
        onAnimationEnd(container, maxHeight);
      }
    });
  }

  setMaxHeight = (event) => {
    if (!this.state.maxHeight) {
      this.setState({ maxHeight: event.nativeEvent.layout.height });
    }
  };

  render() {
    const {
      isOpen,
      onPress,
      text,
      children,
    } = this.props;
    const { maxHeight } = this.state;
    const opacity = isOpen ? 0.8 : 0.3;
    const icon = isOpen ? 'expand-less' : 'expand-more';
    return (
      <View style={styles.containerHidden}>
        <TouchableOpacity onPress={() => onPress(maxHeight)}>
          <View style={styles.buttonContainer}>
            <Text style={[styles.titleText, { opacity }]}>
              {text}
            </Text>
            <Icon name={icon} color={styles.titleText.color} size={20} opacity={opacity}/>
          </View>
        </TouchableOpacity>
        <Animated.View
          style={maxHeight ? { height: this.animHeight } : styles.bodyHidden}
          onLayout={this.setMaxHeight}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  containerHidden: {
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyHidden: {
    position: 'absolute',
    opacity: 0,
  },
  titleText: {
    ...textStyle.caption,
    color: theme.TEXT_COLOR,
    alignSelf: 'center',
  },
});
