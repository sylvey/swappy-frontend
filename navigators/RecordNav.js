import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
import { Assets, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


import Record_BREAKAWAY from '../screens/Record/Record_breakaway';
import Record_CHANGE from '../screens/Record/Record_change';
import Record_UPLOAD from '../screens/Record/Record_upload';


const RTab = createMaterialTopTabNavigator();

const Record = () => {
  const insets = useSafeAreaInsets();
  return(
    <RTab.Navigator
    initialRouteName="BreakAway"
    tabBarOptions={{
        activeTintColor: "#e91e63",
        labelStyle: { fontSize: 15},
        style: {
          marginTop:12,
          elevation: 0,
          
          backgroundColor: 'white',
          height:60,
        }
    }}>
      <RTab.Screen 
        name = "BreakAway" 
        component = {Record_BREAKAWAY}
        options={{ tarBarLabel: 'BreakAway'}}
        />
      
      <RTab.Screen 
        name = "Change" 
        component = {Record_CHANGE} 
        options={{ tarBarLabel: 'Change'}}
        />
      <RTab.Screen 
        name = "Upload" 
        component = {Record_UPLOAD}
        options={{ tarBarLabel: 'Upload'}}
        />
      
    </RTab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow:{
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})

  
export default Record;