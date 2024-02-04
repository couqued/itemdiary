/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState, useEffect} from 'react';
import {StyleSheet, Button, Text, BackHandler, Alert} from 'react-native';
import { NavigationContainer, useIsFocused} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import InitPage from './src/initscreen/initPage';

import {SafeAreaView} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

//import Icon from 'react-native-vector-icons/dist/Ionicons';
//import Icon from 'react-native-vector-icons/MaterialIcons';

//const Stack = createStackNavigator();

let storageUserInfo = "";

console.log("App start");


class App extends Component {
  
  render(){
    return (
      <NavigationContainer>
      <InitPage/>
      </NavigationContainer>
    )
  }
};

const styles = StyleSheet.create({
  test: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;
