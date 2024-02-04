/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * 2023.04.01 백업
 */

import React, {Component, useState, useEffect} from 'react';
import {StyleSheet, Button, Text, BackHandler, Alert} from 'react-native';
import { NavigationContainer, useIsFocused} from '@react-navigation/native';
import {  createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainScreen from './src/mainScreen';
import DetailScreen from './src/detailScreen';
import ModifyScreen from './src/modifyScreen';
import SignUpScreen from './src/main/signUpScreen';
import Test from './src/lib/test1';

import {SafeAreaView} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';


// import Icon from 'react-native-vector-icons/dist/Ionicons';
//import Icon from 'react-native-vector-icons/MaterialIcons';


// const Stack = createStackNavigator();

let storageUserInfo = "";
// const test = async () => {
// console.log("test")
//   await AsyncStorage.getItem('userInfo', (err, result) => {
//     const resultUserInfo = JSON.parse(result);
//     console.log("test resultUserInfo :: "+JSON.stringify(resultUserInfo));
//     storageUserInfo = resultUserInfo.userId;
    
//     if(null !== storageUserInfo && undefined !== storageUserInfo && "" !== storageUserInfo){
//       this.state.isSignUp = true;
//     }
//     console.log("isSignUp set");
//   });
//   return true;
// }

function sleep(delay){
  var start = new Date().getTime();
  while(new Date().getTime() < start + delay); 
}

// async function ChangeState () {
//     console.log("userId::"+AsyncStorage.getItem('userId')); 
//     if(await AsyncStorage.getItem('userId')) {
//       this.setState({isSignUp: true});
//     }else{
//       this.setState({isSignUp: false});
//     }  
// }




class App extends Component {
  state = {
    isSignUp : false
  }
  
  
  

  // startLoading = async () => {
  //   setTimeout(() => {
  //     this.setState({isSignUp: true})
  //   }, 2000);
  // } 
 
  // async ChangeState() {console.log("App start")
  //   useEffect(() => {
  //     if(useIsFocused()){
  //       console.log("userId::"+AsyncStorage.getItem('userId')); 
  //       if(!AsyncStorage.getItem('userId')) {
  //         this.setState({isSignUp: true});
  //       }else{
  //         this.setState({isSignUp: false});
  //       }
  //     }
  //   },[]);
     
  // }
  

  // ChangeState = async () => {
  //     useEffect(() => {
  //     // if(useIsFocused()){
  //       console.log("userId::"+AsyncStorage.getItem('userId')); 
  //       if(!AsyncStorage.getItem('userId')) {
  //         this.setState({isSignUp: true});
  //       }else{
  //         this.setState({isSignUp: false});
  //       }
  //     // }
  //   },[]);
  // }

  
 
  render(){
    // this.ChangeState();
    
    return (
      <NavigationContainer>
      <Test/>
      </NavigationContainer>
      

      // <NavigationContainer>
      //   {this.state.isSignUp ? (
      //     <Stack.Navigator>
      //       <Stack.Screen
      //         name="SignUp"
      //         component={SignUpScreen}
      //         options={{headerShown: false}}
      //       />
      //     </Stack.Navigator>
          
      //   ) : (
      //     <Stack.Navigator>
      //       <Stack.Screen
      //         name="Main"
      //         component={MainScreen}
      //         options={{headerShown: false}}
      //       />
      //     </Stack.Navigator>
      //   )}
      // </NavigationContainer>

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
