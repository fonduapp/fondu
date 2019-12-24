import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import theme from '../styles/theme.style.js';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? theme.PRIMARY_COLOR : theme.SECONDARY_COLOR_2}
    />
  );
}
