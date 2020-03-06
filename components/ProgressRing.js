import React, { Component } from 'react';
import Svg, { Circle, } from "react-native-svg";
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import theme from '../styles/theme.style.js';
import { Icon} from 'react-native-elements';

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    
    const { radius, stroke } = this.props;
    
    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }
  
  render() {
    const { radius, stroke, progress } = this.props;

    const strokeDashoffset = this.circumference - progress / 100 * this.circumference;

    let strokeColor = theme.PRIMARY_COLOR_6;

    if(progress> 75)
      strokeColor = theme.PRIMARY_COLOR;
    else if(progress > 50)
      strokeColor = theme.PRIMARY_COLOR_2;


  
    return (
      <View>
      <Svg
        height={radius * 2}
        width={radius * 2}
        style = {styles.circle}
       >
        <Circle
          style = {styles.circle}
          stroke= {strokeColor}
          fill="transparent"
          strokeWidth={ stroke }
          strokeDasharray={ this.circumference + ' ' + this.circumference }
          style={ { strokeDashoffset } }
          r={ this.normalizedRadius }
          cx={ radius }
          cy={ radius }
         />
          <View style = {{transform: [{ rotate: '90deg' }], 
                          width: radius, 
                          height: radius, 
                          backgroundColor: theme.SECONDARY_COLOR_2, 
                          left: radius - radius/2, 
                          top: radius - radius/2, 
                          borderRadius: 50,
                          }}>
            <Icon name = "face" size={radius} color="white"/>
          </View>
         
      </Svg>
      <View style={{flexGrow: 1,
        flex: 1, width: 70,}}>
      <Text style = {{fontSize:10,alignSelf:'center', textAlign:'center', color: theme.TERTIARY_COLOR}}>Support during Adversity</Text>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle:{
    transform: [{ rotate: '-90deg' }],
    width: 150,
    height: 150,
  },

  });
