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


/* 2. Get the param */
function BreakAwayItemStory ({ route, navigation }) {

    
  const renderImage = ({ item }) => (
    <SafeAreaView style = {{flex:1, flexDirection: 'row'}}>
      <Image 
      style={{flexDirection: 'row', width: 60, height: 60,  }}
      source={{uri:item.source}}/>
    </SafeAreaView> 
  );

  const handleRequest = ({item}) =>(
    <SafeAreaView style = {{flex:1, flexDirection: 'row'}}>
      <Image 
      style={{flexDirection: 'row', width: 60, height: 60,  }}
      source={item.source}/>
    </SafeAreaView> 
  );// 理論上應該是一個Navigation，還要再改
  
  // render(){  
    const { title, story, image, spaceName } = route.params;
    
    return (
      <View style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center'}}>
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
              <Text style = {{right: "15%", fontSize: 20, color: colors.function_100}}>{title}</Text>
          </View>
        </View>
        
        <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
            <Image
              style = {{flex: 5, height: "50%", width: "80%"}}
              source = {{uri:image}}
            />
            <View style = {styles.line}></View>
            
            <View style = {{flex: 4.4, width: "100%"}}>
              
              
              <View style = {{flex: 1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品空間 </Text>
                <Text>{spaceName}</Text>
              </View>
              <View style = {{flex:1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品故事 </Text>
              </View>
              
              <View style = {{flex:7, flexDirection: 'row', height: "10%"}}>
                <View style = {styles.margin}></View>
                <View style = {styles.desContainer}>
                  <Text>{story}</Text>
                </View>
                <View style = {styles.margin}></View>
              </View>

              <View style = {{flex: 3,}}></View>

             
                           
            </View>
            
        </View>
        
      </View>
    );
  // }

}

export default BreakAwayItemStory;

const styles = StyleSheet.create({
  buttonsC:{
    width: "100%",
    position: 'absolute',
    bottom: "30%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText:{
    color: colors.mono_40,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttons: {
    width: "25%",
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.function_100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mono_100,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 3,
  },
  button:{
    width: "10%", 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent:'center'},
  line:{
    height: 2,
    backgroundColor: colors.mono_60,
    width: "82%",
  },
  buttonImage :{
    width: 23, 
    height:20.97, 
    backgroundColor:'transparent'},
  textT:{
    color: colors.function_100,
  },
  margin: { 
    width: "10%", 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent:'center'
  },
  desContainer: {
    width: "80%", 
    borderColor: colors.mono_60, 
    borderWidth: 2
  },
  

});