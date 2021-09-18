import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object
//import { useNavigation } from '@react-navigation/core';

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

import { useMutation,  gql } from '@apollo/client';


const CREATE_REQUEST = gql`
  mutation createRequestItem($requestedItemId: ID!){
    createRequestItem(requestedItemId: $requestedItemId) {
      id
      guyWhoseItemIsRequested{
        id
        username
      },
      requestedItem{
        id
        title
      }
      requester {
        id
        username
      }
      status
    }
  }`;

  

/* 2. Get the param */
function Notification_choiceDetail ({ route, navigation }) {
  const [createRequest, { data, error, loading }] = useMutation(CREATE_REQUEST);

  const { itemID, title, sort, des, method, image } = route.params;
  const naviagation = useNavigation();
  
  // const renderImage = ({ item }) => (
  //   <SafeAreaView style = {{flex:1, flexDirection: 'row'}}>
  //     <Image 
  //     style={{flexDirection: 'row', width: 60, height: 60,  }}
  //     source={item.source}/>
  //   </SafeAreaView> 
  // );

  const handleRequest = () => {
    console.log('request pressed');
    createRequest({ variables: { requestedItemId: itemID } });
    console.log(error);
    console.log(data);
    naviagation.goBack();
    
};
  
  // render(){ 
    
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
              style = {{flex: 5, height: "50%", width: "80%", marginBottom: 10}}
              source = {image? {uri: `http://swappy.ngrok.io/images/${image}`} : require('../../assets/general/商品呈現.png')}
            />
           
            <View style = {styles.line}></View>
            
            <View style = {{flex: 4.4, width: "100%"}}>
              <View style = {{flex: 0.5,flexDirection: 'row'}}></View>
              <View style = {{flex: 1,flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>交付方式 </Text>
                <Text>{method == 1 || method == 3? '面交' : ''}{method == 3? "/": ""}{method == 2 || method == 3? '寄送' : ''}</Text>
              </View>
              
              <View style = {{flex: 1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品種類 </Text>
                <Text>{sort}</Text>
              </View>
              <View style = {{flex:1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品說明 </Text> 
              </View>
              
              <View style = {{flex:7, flexDirection: 'row', height: "10%"}}>
                <View style = {styles.margin}></View>
                <ScrollView style = {styles.desContainer}>
                  <Text>{des}</Text>
                </ScrollView>
                <View style = {styles.margin}></View>
              </View>

              <View style = {{flex: 3,}}></View>

              <View style = {styles.buttonsC}>
                  <TouchableOpacity 
                      style={styles.buttons}
                      onPress={handleRequest}
                      >
                      <Image
                        style = {styles.buttonRound}
                        source = {require('../../assets/breakAway/upload.png')}/>
                  </TouchableOpacity>
              </View>
                           
            </View>
            
        </View>
        
      </View>
    );
  // }

}

export default Notification_choiceDetail;

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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  buttonRound: {
    width: 65,
    height: 65,
    position: 'absolute',
    borderRadius: 31.5,
    backgroundColor: 'transparent',
    bottom: "10%",
    //right: 169,
    alignSelf: 'center',
    justifyContent: 'center',
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