import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PopUp = (props) => {
  const {
    isVisible,
    hide,
    children,
  } = props;
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={hide}
      onBackButtonPress={hide}
    >
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: width/16,
    width: width*5/6,
    top: height/4,
    left: width/12,
    marginLeft: 0,
    flex: 0,
  },
});

export default PopUp;
