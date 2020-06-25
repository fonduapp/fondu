import React, { Component } from 'react';
import {
  ActivityIndicator,
  Modal,
  View,
} from 'react-native';
import theme from '../styles/theme.style.js';

const Loader = (props) => (
  <Modal>
    <View
      flex={1}
      justifyContent="center"
    >
      <ActivityIndicator
        size="large"
        color={theme.PRIMARY_COLOR}
      />
    </View>
  </Modal>
);

export default Loader;
