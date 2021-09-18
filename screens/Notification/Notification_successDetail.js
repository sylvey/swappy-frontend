import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object


import { View,
       Text,
       Button, 
       Image, 
       FlatList, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
import Notification_requesting from './Notification_requesting';


/* 2. Get the param */
function Notification_successDetail ({ route, navigation }) {

  
  // render(){  
    const { id, mything_title, mything_source, requestFor_title, requestFor_source } = route.params;
    
    return (
     
        
        <View style = {{flex: 10, flexDirection:'row', backgroundColor: colors.mono_40, width: "100%", alignItems: 'center', justifyContent:'center' }}>
            <View>
              <Text>你的物品</Text>
              <Image
                style={{ width: 200, height: 200 }}
                source = {mything_source}/>
              <Text>{mything_title}</Text>
            </View>
            
            <View>
              <Text>對方的物品</Text>
              <Image
                style={{ width: 200, height: 200 }}
                source = {requestFor_source? {uri: `http://swappy.ngrok.io/images/${requestFor_source}`} : require('../../assets/general/商品呈現.png')}/>
              <Text>{requestFor_title}</Text>
            </View>

            
            
            
            
        </View>
        
    
    );
  // }

}

export default Notification_successDetail;

const styles = StyleSheet.create({
 

});