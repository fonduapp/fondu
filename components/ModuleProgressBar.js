import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Image, Animated} from 'react-native';
import theme from '../styles/theme.style.js';
import {textStyle} from '../styles/text.style.js';

export default class ContentModule extends Component {

	constructor(props){
		super(props)
	}

	createLabels(indicatorNum){

	}

	createDots(indicatorNum){
	    console.log(this.props.scrollX)

	    const width = this.props.snapToInterval

	    const textOpacityLast = this.props.scrollX.interpolate({
            inputRange: [
              width * (indicatorNum - 3),
              width * (indicatorNum - 2),
              width * (indicatorNum - 1),
            ],
            outputRange: [0, 1, 0.5],
            extrapolate: "clamp"
          });

	     const textOpacityCheck = this.props.scrollX.interpolate({
            inputRange: [
              width * (indicatorNum - 3),
              width * (indicatorNum - 2),
              width * (indicatorNum - 1),
            ],
            outputRange: [0.5, 0.5, 1],
            extrapolate: "clamp"
          });


	    let dots = []

	    for (let i = 0; i < indicatorNum; i++) {

	      const opacity = this.props.scrollX.interpolate({
                inputRange: [
                  width * (i - 1),
                  width * i,
                  width * (i + 1)
                ],
                outputRange: [0.5, 1, 0.5],
                extrapolate: "clamp"
              });

	      const textOpacity = this.props.scrollX.interpolate({
                inputRange: [
                  width * (i - 1),
                  width * i,
                  width * (i + 1)
                ],
                outputRange: [0, 1, 0],
              });

	      //Create the parent and add the children
	      dots.push( 
	      		<View key={i}>
	      			<Animated.View style={{opacity: i == indicatorNum - 1 ? textOpacityCheck : (i == indicatorNum-2 ? textOpacityLast :textOpacity)}}>
			      		<Text style={[styles.label,{color: i==indicatorNum-1? theme.PRIMARY_COLOR_5: theme.TEXT_COLOR}]}>
			      			{i==indicatorNum-1 ? "Check" : "Learn"}
			      		</Text>
		      		</Animated.View>
	                <Animated.View
	                  style={[styles.normalDot, {opacity, backgroundColor: i==indicatorNum-1? theme.PRIMARY_COLOR_5: theme.TEXT_COLOR}]}
	                />
                </View>
          )
	    }

	    return dots
	}

	render() {
		
		return (
		  <View style = {this.props.style}>
			  <View style={[styles.indicatorContainer]}>
	          	 {this.createLabels(this.props.length)}
	          </View>
	          <View style={[styles.indicatorContainer]}>
	             {this.createDots(this.props.length)}
	          </View>
          </View>
                
		);
	}
}

const styles = StyleSheet.create({
  label: {
  	marginBottom: 3,
  	color: theme.TEXT_COLOR,
  	... textStyle.label,
  },
  normalDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.TEXT_COLOR,
    alignSelf: 'center'
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }
});
