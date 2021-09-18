import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Dimensions } from "react-native";
  
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import { useNavigation } from '@react-navigation/core';
//import InvitationData from '../../Data/InvitationData';
//import GroupItems from '../../Data/GroupItems';

import MessageData from '../../Data/MessageData';
import colors from '../../config/colors';
import { TextInput } from 'react-native-gesture-handler';
//import { ScreenWidth } from 'react-native-elements/dist/helpers';
//import { isTypeSystemExtensionNode } from 'graphql';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

export default function Message_Detail ({route, navigation}) {

  const {message, nameShow} = route.params;
  const [comment, setComment] = useState("");

  const renderMessage =  ({item}) =>(
    <View style = {item.owner == nameShow? styles.messageBox:styles.messageBoxMine}>
        <Text style = {{marginLeft:"3%", marginTop: "2%", color: colors.mono_100}}>{item.content}</Text>
    </View>
  );
  
  const handleAddComment = () =>{

      setComment("");
  }
  

  return(
    <View style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center', backgroundColor:colors.mono_40, width:"100%"}}>
        <View style = {{flex: 1, flexDirection: 'row', height: "7%", backgroundColor: colors.mono_40, width:'100%'}}>
          <TouchableOpacity
            style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
            onPress = {()=>navigation.goBack()}
            >
            <Image 
              style = {{height: "25%", width: "25%"}}
              source = {require('../../assets/manyneed/xmark.png')}/>
          </TouchableOpacity>

          <View
            style ={{flex: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.mono_40}}>
              <Text style = {{right: "10%", fontSize: ScreenWidth*0.05, color: colors.function_100, fontWeight:'bold'}}>{nameShow}</Text>
          </View>
        </View>
        <KeyboardAvoidingView behavior = 'height' style = {{flex:11,}}>
            <FlatList
                style ={{width:ScreenWidth, alignSelf:'center', bottom: "10%"}}
                data={message}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                inverted
              />

        </KeyboardAvoidingView>
        <KeyboardAvoidingView
         behavior = 'height'
         style = {styles.commentC}>
              <View style = {styles.comment}>
                  <TextInput
                      //placeholder="comment"
                      style = {{flex:8}}
                      onChangeText={(text) => setComment(text)}
                      value = {comment}/>
                  <TouchableOpacity
                     onPress = {()=>handleAddComment()}
                     style ={{ 
                       flex:1,
                       width: "7%", 
                       height: "100%",
                       justifyContent:'center',
                       alignItems:'center'}}
                   >
                     <Image
                       style ={{
                         width: 15, 
                         height: 15,
                         }} 
                       source = {require('../../assets/breakAway/ok.png')}/>
                   </TouchableOpacity>
              </View> 
              
              
          </KeyboardAvoidingView>    

        


        
        
      </View>
    
  )
}


const styles = StyleSheet.create({
   messageBox:{
    height:ScreenHeight*0.07, 
    width: ScreenWidth*0.7, 
    borderWidth: 1, 
    borderColor:colors.mono_80, 
    marginBottom:ScreenHeight*0.03,
     
    borderRadius: ScreenHeight*0.01,
    left: ScreenWidth*0.02,
   },
   messageBoxMine:{
    height:ScreenHeight*0.07, 
    width: ScreenWidth*0.7, 
    borderWidth: 1, 
    borderColor:colors.function_80, 
    marginBottom:ScreenHeight*0.03, 
    //marginTop:ScreenHeight*0.02, 
    borderRadius: ScreenHeight*0.01,
    left: ScreenWidth*0.28,

   },
   comment: {
    flexDirection:'row',
    flex:8,
    //backgroundColor:colors.mono_80,
    borderRadius:ScreenWidth*0.02,
    height:ScreenWidth*0.1,
    width:"90%",
    borderWidth:1,
    borderColor: colors.function_100,
    marginLeft:"5%",
    marginRight: "5%",
    //position:'absolute',
    bottom: 0,
  },
  commentC: {
    flexDirection:'row',
    //flex:1,
    backgroundColor:colors.mono_40,
    height:"7%",
    width:"100%",
    alignItems:'center',
    position:'absolute',
    bottom: 40,
  },
    
    
     
});