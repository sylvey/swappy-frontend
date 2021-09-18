import { styleSheets } from 'min-document';
import React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity, 
    TextInput,
    Alert,
    Platform,
    useWindowDimensions,
    FlatList,
    SafeAreaView,
    Image,
    Dimensions,
    ScrollView, 
    KeyboardAvoidingView,
    } from 'react-native';
import RecordData from '../../Data/RecordData';
// import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';
// import * as ImagePicker from 'expo-image-picker';
// import * as SQLite from "expo-sqlite";
import colors from '../../config/colors';


import { useQuery, gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;


const QUERY_MY_REQUESTS = gql`
query getMySuccessfulRequests {
  getMySuccessfulRequests {
    id
    requestedItem {
      title
      image
      category
    }
    guyWhoseItemIsRequested {
      username
      id
    }
    requester {
      username
			id
    }
    requestersItem {
      title
      image
      category
    }
    guyWhoseItemIsRequestedReceived
    guyWhoseItemIsRequestedScored
    requesterReceived
    requesterScored
  }
}`;


const Record = () => {

  const [userId, setUserId] = useState(null);

AsyncStorage.getItem('userId')
  .then((data) => {
    console.log(data);
    setUserId(data);
  });


  const navigation = useNavigation();
  const { data, error, loading } = useQuery(QUERY_MY_REQUESTS, {pollInterval: 500});
  console.log(data);
  const handleNavigation = (myUsername, otherGuyId, id, mythingImage, mythingTitle, mythingCategory, IRecieved, IScored, requestForImage, requestForTitle, requestForCategory, requestForRecieved, requestForScored) => {
    //console.log(item);
    
    if (IRecieved && requestForRecieved){ // 如果雙方都收到 item.status == 2
      if (!IScored){ // 如果我還沒評分 item.statusToMe == 1
        navigation.navigate('Star', {myUsername: myUsername, otherGuyId: otherGuyId, id: id, mythingImage: mythingImage, requestForImage: requestForImage, requestForTitle: requestForTitle});
      }
      else{ //如果我已經評分
        navigation.navigate('Complete', {requestForImage: requestForImage, requestForTitle: requestForTitle});
      }
    }
    else{ // 如果雙方還沒收到
      navigation.navigate('RecordDetail', {
        myUsername: myUsername, 
        otherGuyId: otherGuyId,
        id: id,
        mythingTitle: mythingTitle, 
        mythingImage: mythingImage, 
        IRecieved: IRecieved,
        IScored: IScored,
        requestForTitle: requestForTitle, 
        requestForTag: requestForCategory, 
        requestForImage: requestForImage, 
        requestForRecieved: requestForRecieved, 
        requestForScored: requestForScored, 
      })
    }
  }

  const renderItem = ({ item }) => {
    console.log(item);
    

    return (
    //console.log(this.props.navigation);
    <SafeAreaView style={styles.boxContainer}>
      <View style={styles.buttons}>
        { item.guyWhoseItemIsRequested.id == userId ?
        ( <TouchableOpacity 
          style={styles.item}
          onPress={() => handleNavigation(
            item.guyWhoseItemIsRequested.username, 
            item.requester.id,
            item.id,
            item.requestedItem.image, 
            item.requestedItem.title, 
            item.requestedItem.category, 
            item.guyWhoseItemIsRequestedReceived, 
            item.guyWhoseItemIsRequestedScored, 
            item.requestersItem.image, 
            item.requestersItem.title, 
            item.requestersItem.category, 
            item.requesterReceived,
            item.requesterScored
          )}
          >
            <Image
              source =  {item.requestersItem.image? {uri: `http://swappy.ngrok.io/images/${item.requestersItem.image}`} : require('../../assets/general/商品呈現.png')}
              style ={{height: ScreenHeight*0.13, width: ScreenHeight*0.13,}}/>
            
            <View style = {{marginLeft: 16}}>
                <Text style={styles.title}>{item.requestersItem.title}</Text>
                <Text style = {{marginTop: "5%", color: colors.function_100}}>#{item.requestersItem.category}</Text>
                <Text style = {{marginLeft: "60%", color: colors.function_100}}>{(item.guyWhoseItemIsRequestedReceived)? (item.guyWhoseItemIsRequestedScored?"已評價": "已收到"):"運送中"}</Text>
            </View>   
        </TouchableOpacity> ) : (
          <TouchableOpacity 
          style={styles.item}
          onPress={() => handleNavigation(
            item.requester.username, 
            item.guyWhoseItemIsRequested.id,
            item.id,
            item.requestersItem.image, 
            item.requestersItem.title, 
            item.requestersItem.category, 
            item.requesterReceived,
            item.requesterScored,
            item.requestedItem.image, 
            item.requestedItem.title, 
            item.requestedItem.category,
            item.guyWhoseItemIsRequestedReceived, 
            item.guyWhoseItemIsRequestedScored, 
          )}
          >
            <Image
              source =  {item.requestedItem.image? {uri: `http://swappy.ngrok.io/images/${item.requestedItem.image}`} : require('../../assets/general/商品呈現.png')}
              style ={{height: ScreenHeight*0.13, width: ScreenHeight*0.13,}}/>
            
            <View style = {{marginLeft: 16}}>
                <Text style={styles.title}>{item.requestedItem.title}</Text>
                <Text style = {{marginTop: "5%", color: colors.function_100}}>#{item.requestedItem.category}</Text>
                <Text style = {{marginLeft: "60%", color: colors.function_100}}>{(item.requesterReceived)? (item.requesterScored?"已評價": "已收到"):"運送中"}</Text>
            </View>   
          </TouchableOpacity>
        )
        }
      </View>
    </SafeAreaView>
  )};  



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
                <Text style = {{right: "15%", fontWeight:'bold', fontSize: 20, color: colors.mono_100}}>所有訂單</Text>
            </View>
          </View>

          <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
            {data ? (
              <>
              <FlatList
              style = {{marginBottom:60}}
              data = {data.getMySuccessfulRequests}
              renderItem = {renderItem}/>
              </>
            ) : <Text>loading ...</Text>}
            
            
          </View>
      </View>
    )
    


}

export default Record;

const styles = StyleSheet.create({
  item: {
    flexDirection:'row',
    backgroundColor: 'transparent',
    //padding: 20,
    height: "100%",
    //marginVertical: 8,
    //marginHorizontal: 16,
  },
  title: {
    fontSize: 33,
  },
  boxContainer: {
    marginTop: ScreenHeight*0.03,
    height: ScreenHeight*0.13,
    width: ScreenWidth*0.85,
    backgroundColor: colors.mono_40,
    //left: 30,
    //alignItems: 'center',
    justifyContent: 'center',
    bottom: ScreenHeight*0.03,
    borderColor: colors.mono_60,
    borderWidth: 1,
    
    // shadowColor: colors.mono_100,
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.5,
    // shadowRadius: 0,
    // elevation: 3,
  },
  buttons: {
    //flexDirection: 'row'
    flex:1,
    backgroundColor: 'transparent',
  },

})
