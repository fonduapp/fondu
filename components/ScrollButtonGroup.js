import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import theme from '../styles/theme.style';
import Color from 'color';
import { textStyle } from '../styles/text.style';
import { shadowStyle } from '../styles/shadow.style.js';


const buttonMarginHorizontal = 13;
const buttonsPerColumn = 3;

export default class ScrollButtonGroup extends Component {
  getIntervalWidth() {
    return this.props.contentWidth + 2 * buttonMarginHorizontal;
  }

  componentDidUpdate(prevProps) {
    const {
      itemList,
      selectedItem,
      scrollToSelected,
    } = this.props;
    if (
      (!prevProps.scrollToSelected && scrollToSelected)
      || (selectedItem !== prevProps.selectedItem && selectedItem !== undefined)
    ) {
      const selectedIndex = Math.max(0, itemList.indexOf(selectedItem));
      const targetColumn = Math.floor(selectedIndex / buttonsPerColumn);
      this.scroll.scrollTo({ x: targetColumn * this.getIntervalWidth() });
    }
  }

  render() {
    const {
      contentWidth,
      screenWidth,
      itemList,
      selectedItem,
      selectedButtonStyle,
      onPress,
      selectedButtonColor,
      disabledItemList = [],
    } = this.props;

    const numberOfColumns = Math.ceil(itemList.length / buttonsPerColumn);

    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: (screenWidth - contentWidth) / 2,
        backgroundColor: Color(theme.TEXT_COLOR).alpha(0.04).string(),
        paddingTop: 6,
      },
      columnContainer: {
        width: contentWidth,
      },
      buttonContainer: {
        width: '100%',
        marginBottom: 13,
      },
      button: {
        backgroundColor: 'white',
        ...shadowStyle.primaryShadowStyle,
        borderRadius: 20,
        justifyContent: 'center',
        height: 75,
        paddingHorizontal: 10,
      },
      selectedButton: {
        backgroundColor: selectedButtonColor,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
      },
      disabledButton: {
        backgroundColor: Color(theme.INACTIVE_COLOR).alpha(0.2).string(),
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
      },
      text: {
        ...textStyle.header4,
        color: theme.TEXT_COLOR,
        opacity: 0.8,
        textAlign: 'center',
      },
      selectedText: {
        color: 'white',
        opacity: 1,
      },
      disabledText: {
        opacity: 0.2,
      },
    });

    return (
      <ScrollView
        ref={(node) => { this.scroll = node; }}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={contentWidth + 2 * buttonMarginHorizontal}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.container}
      >
        {Array.from(
          Array(numberOfColumns),
          (_, i) => {
            const column = itemList.slice(buttonsPerColumn * i, buttonsPerColumn * (i + 1));
            return (
              <View
                key={column+i}
                style={styles.columnContainer}
                marginLeft={i > 0 ? buttonMarginHorizontal : 0}
                marginRight={i < numberOfColumns - 1 ? buttonMarginHorizontal : 0}
              >
                {column.map((item, j) => {
                  const isSelected = item === selectedItem;
                  const isDisabled = !isSelected && disabledItemList.includes(item);
                  return (
                    <View key={item+j} style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => onPress(item)}
                        disabled={isSelected || isDisabled}
                        style={[
                          styles.button,
                          isSelected ? styles.selectedButton : {},
                          isDisabled ? styles.disabledButton : {},
                        ]}
                      >
                        <Text style={[
                          styles.text,
                          isSelected ? styles.selectedText : {},
                          isDisabled ? styles.disabledText : {},
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          },
        )}
      </ScrollView>
    );
  }
}
