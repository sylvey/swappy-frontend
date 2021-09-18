import React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import colors from '../../config/colors';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import _ from "lodash"; 
import { useQuery,  gql } from '@apollo/client';
import { ScrollView } from 'react-native-gesture-handler';

//import { ScreenWidth } from 'react-native-elements/dist/helpers';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;


const AboutSwappy = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center', backgroundColor:colors.mono_40}}>
            <View style = {{flex: 1, flexDirection: 'row', height: "7%", backgroundColor: colors.mono_40}}>
              <TouchableOpacity
                style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
                onPress = {()=>navigation.goBack()}
                >
                <Image 
                  style = {{height: "25%", width: "25%"}}
                  source = {require('../../assets/manyneed/xmark.png')}/>
              </TouchableOpacity>

              <View
                style ={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style = {{right: "15%", fontSize: 20, color: colors.function_100}}>關於Swappy</Text>
              </View>
            </View>
            <View style = {{flex:11, width: "85%"}}>
                <ScrollView>
                    <Text style = {styles.content}>Swappy是由WYL.團隊開發出的交換平台，意在改善時下交換平台的痛點。Swappy針對易用性、互動性以及社群性為旨做開發，期望能為用戶帶來良好的交換體驗。</Text>
                    <Text></Text>
                    <Text style = {styles.title}>為什麼要用Swappy？</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.content}>時下交換平台，常存在著換物不夠有效率、用戶猶豫換出物品時間過長、以及缺乏歸屬感的問題。Swappy針對此三點做分析，打造了其他換物平台所沒有的獨家功能：群組換物、斷捨離、社群發文機制，讓您在換物上有更良好的體驗。</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.title2}>群組換物功能</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.content}>Swappy提供獨家群組換物功能，讓用戶自創群組，在群組內配對物品，進行特定物品的交換。在提高效率的同時，也讓用戶能找到具有歸屬感的換物群體。</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.title2}>斷捨離挑戰</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.content}>Swappy提供自創的斷捨離挑戰，讓用戶可放上正在猶豫是否換出的物品，並設定時限，讓自己充分猶豫過後，決定是否換出物品。</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.title2}>社群</Text>
                    <View style = {styles.margin}></View>
                    <Text style = {styles.content}>相較其他換物平台，Swappy提供社群平台，讓用戶在換物過程中找到同好，建立換友群體中的歸屬感。</Text>
                </ScrollView>
            </View>
            
        </View>

      
    )
  

}

export default AboutSwappy;

const styles = StyleSheet.create({
    margin:{
        height:ScreenWidth*0.02,
    },
    title:{
        fontSize:ScreenWidth*0.042,
        fontWeight:'bold',
        color: colors.function_100,
    },
    title2:{
        fontSize:ScreenWidth*0.037,
        color: colors.function_80,
    },
    content:{
        color: colors.mono_100,
        fontSize:ScreenWidth*0.035,
    }
})

