import React, { useState, useEffect } from 'react';

import { 
   View,
   Text, 
   SafeAreaView,  
   FlatList, 
   StyleSheet, 
   TouchableOpacity, 
   ScrollView,
   Dimensions } from "react-native";

import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import  { useNavigation } from '@react-navigation/core';

import GroupItems from '../../Data/GroupItems';
import RequestingFail from '../../Data/RequestingFail';
import RequestingSuccess from '../../Data/RequestingSuccess';
import RequestingWaiting from '../../Data/RequestingWaiting';
import Notification_invitation from './Notification_invitation';
import colors from '../../config/colors';

import { useQuery, useMutation,  gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;

const DELETE_FAIL = gql`
mutation deleteFail {
  deleteFail
}`;

const RENDER_REQUESTS = gql`
query getRequestingRequests{
  getRequestingRequests {
    id
    requestedItem {
      title
      image
      id
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
      id
    }
    status
  }
}`;


const Notification_requesting = () => {
  
  const[fail, setFail] = useState([]);
  const[success, setSuccess] = useState([]);
  const[waiting, setWaiting] = useState([]);

  const navigation = useNavigation();

  const[requestData, setRequestData] = useState([]);
  const[failData, setFailData] = useState([]);
  const[successData, setSuccesData] = useState([]);
  const[waitingData, setWaitingData] = useState([]);
 
  const { data, error, loading } = useQuery(RENDER_REQUESTS, {pollInterval: 500});
  const [deleteFail] = useMutation(DELETE_FAIL);

  // console.log(loading, data, error);
  

  // useEffect(()=> {
  //   console.log(data);
  //   if(data){
  //     setRequestData(data.getRequestingRequests);
  //     console.log(requestData);

  //     //filter request data to waiting, success and fail
  //     const _waiting = requestData.filter(request => request.status == "WAITING");
  //     const _success = requestData.filter(request => request.status == "SUCCESS");
  //     const _fail = requestData.filter(request => request.status == "FAIL");

  //     console.log(_waiting, _success, _fail);

  //     setWaitingData(_waiting);
  //     setSuccesData(_success);
  //     setFailData(_fail);
  //   }
  //   if(loading) {
  //     console.log('loading...')
  //   }
  // },[data])

  // useEffect(() => {
  //   if (data) {
  //     console.log(data);
  //     setRequestData(data.getRequestingRequests);
  //     console.log(requestData);

  //     //filter request data to waiting, success and fail
  //     const _waiting = requestData.filter(request => request.status == "WAITING");
  //     const _success = requestData.filter(request => request.status == "SUCCESS");
  //     const _fail = requestData.filter(request => request.status == "FAIL");

  //     console.log(_waiting, _success, _fail);
  //     setWaitingData(_waiting);
  //     setSuccesData(_success);
  //     setFailData(_fail);

  //   }
  // }, [data]);


  

  const renderFail = ({ item }) => {
    return (
    <TouchableOpacity 
      style={styles.fail}>
      <Text style={styles.title, {color: colors.warning_100}}>{item.requestedItem.title}</Text>
    </TouchableOpacity>
  )
};

  const renderSuccess = ({ item }) => {
    console.log(item);
    return (
    //console.log(this.props.navigation);
    <TouchableOpacity 
      // onPress = {()=>navigation.navigate("NotificationSuccessDetail",{ 
      //   id: item.id,
      //   mything_title: item.requestersItem == null ? null : item.requestersItem.title, 
      //   mything_source: item.requestersItem == null ? null : item.requestersItem.image, 
      //   requestFor_title: item.requestedItem.title, 
      //   requestFor_source: item.requestedItem.image})} 
      style={styles.success}>
      <Text style={styles.title, {color: colors.mono_40}}>{item.requestedItem.title}</Text>
    </TouchableOpacity>
  )

};

  const renderWaiting = ({ item }) => {
  return (
    
    //console.log(this.props.navigation);
    <TouchableOpacity 
      onPress = {()=> {

        navigation.navigate("NotificationWaitingDetail",{ 
          id: item.id,
          mything_title: item.requestersItem == null ? null : item.requestersItem.title, 
          mything_source: item.requestersItem == null ? null : item.requestersItem.image, 
          requestFor_user: item.guyWhoseItemIsRequested.id,
          requestFor_title: item.requestedItem.title ? item.requestedItem.title : null , 
          requestFor_source: item.requestedItem.image})} 
        }
      style={styles.waiting}>
      <Text style={styles.title, {color: colors.mono_80}}>{item.requestedItem.title}</Text>
    </TouchableOpacity>
  )};

  // componentDidMount() {
  //   this.setState({
  //     fail: RequestingFail,
  //     success: RequestingSuccess,
  //     waiting: RequestingWaiting,
  //   });
  // }

  useEffect(()=>{
    setFail(RequestingFail);
    setSuccess(RequestingSuccess);
    setWaiting(RequestingWaiting);
  })
  

    // const[grvalue, grsetValue] = useState('');
    //const{ navigate } = this.props.navigation;
    //console.log(this.props.navigation);

  return(
    // <View style = {{alignItems: 'center'}}>
        <ScrollView style={styles.container}>
          {data? (<>
                <FlatList
                  data={data.getRequestingRequests.filter(request => request.status == "SUCCESS")}
                  renderItem={renderSuccess}
                  keyExtractor={item => item.id}
                />

                <FlatList
                  data={data.getRequestingRequests.filter(request => request.status == "WAITING")}
                    renderItem={renderWaiting}
                  keyExtractor={item => item.id}
                />

                <FlatList
                  data={data.getRequestingRequests.filter(request => request.status == "FAIL")}
                  renderItem={renderFail}
                  keyExtractor={item => item.id}
                />
              </>) : <Text>loading...</Text>
          }

        </ScrollView>
    // </View>
  )
  

}

export default Notification_requesting;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mono_40,
    },
    success: {
      backgroundColor: colors.main_80,
      width: ScreenWidth*0.9,
      padding: 20,
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: "5%",
      borderRadius: ScreenWidth*0.01,
    },
    fail: {
      backgroundColor: colors.mono_40,
      width: ScreenWidth*0.9,
      borderWidth: 1,
      padding: 20,
      alignItems: 'center',
      marginVertical: 8,
      borderColor: colors.warning_100,
      borderStyle: 'dashed',
      borderRadius: 1,
      marginHorizontal: "5%",
    },
    waiting: {
      backgroundColor: colors.mono_40,
      borderRadius: 1,
      width: ScreenWidth*0.9,
      padding: 20,
      borderWidth:1,
      borderColor: colors.mono_80,
      borderStyle: 'dashed',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: "5%",
    },
    title: {
      fontSize: 22,
      fontWeight: '900',
      //color: colors.mono_40,
    },
    button: {
      width: 60,
      height: 60,
      position: 'absolute',
      borderRadius: 30,
      backgroundColor: '#ee6e73',
      bottom: 150,
      right: 175,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });