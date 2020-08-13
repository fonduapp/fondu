import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import StyledButtonGroup from '../components/StyledButtonGroup';
import { longDayNamesStartingMonday } from '../constants/Date';
import Color from 'color';
import NextButton from './NextButton';
import theme from '../styles/theme.style';
import { textStyle } from '../styles/text.style';

const CheckpointDayButtonGroup = (props) => {
  const {
    containerStyle,
    onPress,
    selectedDay,
  } = props;

  const daysOfTheWeek = longDayNamesStartingMonday;

  return (
    <StyledButtonGroup
      containerStyle={containerStyle}
      onPress={(index) => {
        onPress(daysOfTheWeek[index]);
      }}
      selectedIndex={daysOfTheWeek.indexOf(selectedDay)}
      buttons={daysOfTheWeek}
      addEmphasisArray={daysOfTheWeek.map(
        (day) => ['Saturday', 'Sunday'].includes(day)
      )}
      emphasisColor={Color('white').alpha(0.5).string()}
    />
  );
}

const SetCheckpointDayPage = (props) => {
  const {
    styles: {
      startScreen,
      nextButtonContainer,
    },
    onPressCheckpointDay,
    selectedDay,
    onPressNext,
  } = props;

  const styles = {
    container: {
      alignItems: 'flex-start',
    },
    title: {
      ...textStyle.header,
      color: theme.TEXT_COLOR,
    },
    paragraphContainer: {
      marginVertical: 13,
    },
    paragraph: {
      ...textStyle.caption,
      color: Color(theme.TEXT_COLOR).alpha(0.5).string(),
    },
    buttonGroupContainer: {
      width: '100%',
      marginBottom: 10,
    },
    footnote: {
      ...textStyle.footer,
      color: Color(theme.TEXT_COLOR).alpha(0.3).string(),
    },
  };

  return (
    <>
      <View style={[startScreen, styles.container]}>
        <Text style={styles.title}>
          Setting your checkpoint day
        </Text>
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            {"We want to make sure your relationship skills are sharp and you're practicing the techniques you'll learn through short, weekly assessments. Which day of the week is most convenient for you?"}
          </Text>
        </View>
        <CheckpointDayButtonGroup
          containerStyle={styles.buttonGroupContainer}
          onPress={onPressCheckpointDay}
          selectedDay={selectedDay}
        />
        <Text style={styles.footnote}>
          This information can be changed later
        </Text>
      </View>
      <View style={nextButtonContainer}>
        <NextButton
          onPress={onPressNext}
          title="DONE"
        />
      </View>
    </>
  );
};

export default SetCheckpointDayPage;
