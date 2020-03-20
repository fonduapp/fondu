/**
 * Author: Miguel Caballero
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {Platform, Dimensions, View, StyleSheet, ScrollView, Image, Text, TouchableWithoutFeedback} from 'react-native';

const DEFAULT_STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? 20 : 0;
const DEFAULT_NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 44 : 54;
const STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? 20 : 0;
const NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 44 : 54;
const OFFSET = STATUS_BAR_HEIGHT + NAVBAR_HEIGHT;

export default class Screen extends Component {
  static propTypes = {
    backgroundImage: PropTypes.number,
    backgroundColor: PropTypes.string,
    marginTop: PropTypes.number,
    bottomTabHeight: PropTypes.number,
    topTabHeight: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    fullScreen: PropTypes.bool,
    tabs: PropTypes.string,
    scrollable: PropTypes.bool,
    navBarHeight: PropTypes.number,
    statusBarHeight: PropTypes.number

    // optionalNumber: PropTypes.number,
    // optionalObject: PropTypes.object,
    // requiredFunc: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  /**
   * Compute the height of the NavBar default provided by the library
   * @returns {number}
   * @private
   */
  _computeNavBarHeight() {
    let navbar = 0;

    if (!this.props.hideNavBar) {
      navbar = this.props.navBarHeight ? this.props.navBarHeight : DEFAULT_NAVBAR_HEIGHT;
    }

    let statusbar = this.props.statusBarHeight ? this.props.statusBarHeight : DEFAULT_STATUS_BAR_HEIGHT;
    return statusbar + navbar;
  }



  _screenStyles() {
    let marginTop = 0;
    let marginBottom = ['bottom', 'both'].includes(this.props.tabbar) ? this.props.bottomTabHeight : 0;

    return {
      backgroundColor: this.props.backgroundImage ? 'transparent' : this.props.backgroundColor || '#FFF',
      //backgroundColor: this.props.backgroundColor || 'transparent',
      marginTop: marginTop,
      marginBottom: marginBottom,
    };
  }

  _contentContainerStyles() {
    let headerHeight = this._computeNavBarHeight();
    let marginTop = (this.props.hideNavBar ? STATUS_BAR_HEIGHT : headerHeight) + (['top', 'both'].includes(this.props.tabbar) ? this.props.topTabHeight : 0);
    return {
      flex: 1,
      backgroundColor: this.props.backgroundImage ? 'transparent' : '#FFF',
      marginTop: marginTop,
      paddingTop: this.props.paddingTop || (this.props.hideNavBar ? 0 : 0),
      paddingHorizontal: this.props.paddingHorizontal || 0
    };
  }

  _renderView() {
    let screenStyles = this._screenStyles();
    let contentStyles = this._contentContainerStyles();

    let view;
    if (this.props.backgroundImage) {
      view = (
        <Image style={styles.container} source={this.props.backgroundImage}>
          <View style={[styles.screen, screenStyles]}>

            <View style={contentStyles}>
              {this.props.children}
            </View>

          </View>
        </Image>

      );
    } else {
      view = (
        <View style={[styles.screen, screenStyles]}>
          <View style={contentStyles}>
            {this.props.children}
          </View>
        </View>
      );
    }


    return view;
  }

  render() {
    let view = this._renderView();

    return view;
  }
}

let styles = StyleSheet.create({
  screen: {
    zIndex: 0,
    flex: 1
  },
  container: {
    zIndex: 0,
    flex: 1,
    width: null,
    height: null,
  },
});