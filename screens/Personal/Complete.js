import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object

import { View,
       Text,
       Button, 
       Image, 
       TextInput, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       KeyboardAvoidingView,
       StyleSheet, 
       Dimensions} from "react-native";
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
//import Notification_requesting from './Notification_requesting';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
/* 2. Get the param */
function Complete ({ route, navigation }) {

  
  // render(){  
    const { requestForImage, requestForTitle } = route.params;
    
    return (
     
        <View style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center', backgroundColor:colors.mono_40}}>
            <View style = {{flex: 1, flexDirection: 'row', height: "7%", backgroundColor: colors.mono_40}}>
              <TouchableOpacity
                style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
                onPress = {()=>navigation.navigate('Record')}
                >
                <Image 
                  style = {{height: "25%", width: "25%"}}
                  source = {require('../../assets/manyneed/xmark.png')}/>
              </TouchableOpacity>

              <View
                style ={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
                
              </View>
            </View>


            <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
                <Image
                    style = {{width:ScreenWidth*0.6, height:ScreenWidth*0.6, marginTop: ScreenHeight*0.2}}
                    source = {{uri: `http://swappy.ngrok.io/images/${requestForImage}`}}/>
                
                <Image
                    style = {{marginTop: ScreenHeight*0.05, width:ScreenWidth*0.1, height:ScreenWidth*0.1}}
                    source = {require('../../assets/personal/禮物.png')}/>
    
                <View style = {{
                    marginTop:ScreenHeight*0.05, 
                    width: ScreenWidth*0.7, 
                    height:ScreenWidth*0.1, 
                    alignItems:'center',
                    justifyContent:'center',
                    alignSelf:'center',
                    borderRadius:ScreenWidth*0.05,
                    borderWidth:1,
                    borderColor:colors.function_100}}>
                    <Text style ={{color:colors.function_100, fontSize: ScreenWidth*0.04}}>換到了{requestForTitle}, 太棒了吧！</Text>
                
                </View>
         
            </View>
               
            
        </View>
        
    
    );
  // }

}

export default Complete;

const styles = StyleSheet.create({
    

});