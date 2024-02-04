/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Button, Text} from 'react-native';
import TabHomeScreen from './src/home_tab2';
import TabWriteScreen from './src/write_tab2';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

// import Icon from 'react-native-vector-icons/dist/Ionicons';
//import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

const TabBarIcon = (focused, name) => {
  let iconName;

  if(name === 'Home'){
    iconName = 'home-outline'
  }else if(name ==='Write'){
    iconName = 'mail-outline'
  }

  iconSize = focused ? 30 : 20
  return (
    <Ionicons
      name={iconName}
      size={iconSize}
    />
  )
}

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          tabBarOptions={{
            //activeBackgroundColor: 'skyblue',
            activeTintColor: 'blue',
            inactiveTintColor: 'black',
            style: {
              backgroundColor: '#c6cbef'
            }
          }}
          screenOptions={({route})=>({
            tabBarLabel: route.name,
            tabBarIcon: ({focused})=>(
              TabBarIcon(focused, route.name)
            )
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={TabHomeScreen} 
            options={{
              title:'목록',
              // tabBarIcon: ({color, size}) => (
              //   <Icon name="home" color={color} size={size} />
              // )
            }}
          />
          <Tab.Screen 
            name="Write" 
            component={TabWriteScreen} 
            options={{
              title:'등록하기',
              // tabBarIcon: ({color, size}) => (
              //   <Icon name="Write" color={color} size={size} />
              // )
            }}

          />
        </Tab.Navigator>
        
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
