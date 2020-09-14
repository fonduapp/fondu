import React from 'react';
import { Switch } from 'react-native';
import theme from '../styles/theme.style.js';
import Color from 'color';

export default (props) => (
  <Switch
    // https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/colors_material.xml#51
    thumbColor="#f1f1f1" 
    trackColor={{ true: Color(theme.PRIMARY_COLOR).alpha(0.5).string() }}
    {...props}
  />
);
