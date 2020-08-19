import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import theme from '../styles/theme.style.js';

const StyledButtonGroup = (props) => {
  const {
    containerStyle,
    onPress,
    selectedIndex,
    buttons,
    addEmphasisArray,
    emphasisColor,
  } = props;

  const styles = {
    defaultContainer: {
      alignSelf: 'center',
      backgroundColor: theme.SECONDARY_COLOR,
      borderRadius: 25,
    },
    textContainer: {
      flexDirection: 'row',
    },
    rightText: {
      flex: 1,
      textAlign: 'right',
    },
  };

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      {buttons.map((button, i) => {
        const buttonStyles = {
          outerContainer: {
            paddingTop: i === 0 ? '5%' : 0,
            paddingBottom: i === buttons.length - 1 ? '5%' : 0,
            paddingHorizontal: '11.5%',
            backgroundColor: addEmphasisArray && addEmphasisArray[i]
              ? emphasisColor
              : 'transparent',
          },
          buttonContainer: {
            height: 40,
            alignItems: 'center',
            borderColor: i < selectedIndex - 1 || i > selectedIndex
              ? theme.TRANSLUCENT_GRAY
              : 'transparent',
            ...(i !== buttons.length - 1 ? { borderBottomWidth: 1 } : []),
          },
          button: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 20,
            width: '120%',
            paddingHorizontal: '8.5%',
            backgroundColor: 'transparent',
            ...(selectedIndex === i
              ? {
                  backgroundColor: 'white',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                }
              : {}
            ),
          },
          text: {
            fontSize: 14,
            color: theme.TEXT_COLOR_2,
            fontFamily: 'poppins-bold',
            textTransform: 'uppercase',
            opacity: selectedIndex < 0 || selectedIndex === i ? 1.0 : 0.5,
          },
        };

        return (
          <View key={i} style={buttonStyles.outerContainer}>
            <View style={buttonStyles.buttonContainer}>
              <TouchableOpacity
                onPress={() => onPress(i)}
                style={buttonStyles.button}
              >
                <View style={styles.textContainer}>
                  <Text style={buttonStyles.text}>
                    {button.left ? button.left : button}
                  </Text>
                  {button.right && (
                    <Text style={[buttonStyles.text, styles.rightText]}>
                      {button.right}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default StyledButtonGroup;
