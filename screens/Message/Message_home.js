import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import { useNavigation } from '@react-navigation/core';
//import InvitationData from '../../Data/InvitationData';
//import GroupItems from '../../Data/GroupItems';

import MessageData from '../../Data/MessageData';
import colors from '../../config/colors';
import { isTypeSystemExtensionNode } from 'graphql';
//import { ScreenWidth } from 'react-native-elements/dist/helpers';
//import { isTypeSystemExtensionNode } from 'graphql';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

export default function Message_home () {

  const[data, setData] = useState([]);
  //const navigation = useNavigation();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
      //console.log(this.props.navigation);
      <TouchableOpacity 
        style = {{flexDirection: 'row', height: ScreenHeight*0.08, justifyContent: 'center', borderBottomColor: colors.mono_60, borderBottomWidth:1,  alignItems: 'center'}}
        onPress = {()=>navigation.navigate("MessageDetail", {message: item.message, nameShow : item.nameShow})}
        >
            <Image
                style = {{height: ScreenHeight*0.08, width:ScreenHeight*0.08 }}
                source = {item.profile}/>

           
            <View style = {styles.item}>
                <Text style={{marginLeft: 10, marginTop: ScreenHeight*0.005, fontSize: ScreenHeight*0.02, color: colors.mono_100}}>{item.nameShow}</Text>
                <Text style={{marginLeft: 10, marginTop: ScreenHeight*0.010,fontSize: ScreenHeight*0.015, color: colors.mono_80 }}>{item.message[item.message.length - 1].content} </Text>
                <Text style={{position:'absolute', bottom:1, right:10,marginLeft: 10, fontSize: ScreenWidth*0.025, color: colors.mono_80 }}>{item.message[item.message.length - 1].time}</Text>
            </View> 

      </TouchableOpacity>
      

  );

 
  useEffect(() => {
    const datafilter = _.filter(MessageData, item => {
        if(item.owner[0].name == "sylvia" || item.owner[1].name == "sylvia")
        {
            return true;
        }
        return false;
    })

    let arr = datafilter.map((item, index)=>{
        if(item.owner[0].name == "sylvia")
        {
            item.profile = item.owner[1].profile
            item.nameShow = item.owner[1].name
        }
        else if(item.owner[1].name == "sylvia")
        {
            item.profile = item.owner[0].profile
            item.nameShow = item.owner[0].name
        }
        return {...item}
    })
    //nameShow is the one I'm talking to

    console.log(arr)

    setData(arr);
    
  },[]);

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
            style ={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style = {{right: "10%", fontSize: ScreenWidth*0.05, color: colors.function_100, fontWeight:'bold'}}>對話紀錄</Text>
          </View>
        </View>
        <View style = {{flex: 11, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
            <ScrollView style = {{ flex: 10, width: "100%", backgroundColor: colors.mono_40 }}>
              <FlatList
                style ={{borderWidth:1, borderColor: colors.mono_60, width:ScreenWidth*0.9, alignSelf:'center'}}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </ScrollView>
        </View>
        
      </View>
    
  )
}


const styles = StyleSheet.create({
    margin: {
      width: "5%",
      backgroundColor:"transparent",
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
      width: "100%",
    },
    complete:{ 
      flexDirection: 'row',
      marginTop: 20,
      height: 90, 
      width:"90%",
      backgroundColor: 'transparent',
      justifyContent:'center',
    },
    item: {
      flex: 6,
      backgroundColor: colors.mono_40,
      //padding: 20,
      height: "100%",
      //left:2,
      //marginVertical: 8,
      //backgroundColor:'red',
      width: "60%",
    },
     
});