import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object
//import { useNavigation } from '@react-navigation/core';
import { Paragraph, Dialog, Portal } from 'react-native-paper';

import { View,
       Text,
       Button, 
       Image, 
       FlatList, 
       SafeAreaView, 
       Dimensions,
       ScrollView, 
       TouchableOpacity,
       StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
import person_star_comment from '../../Data/person_star_comment';
import { useQuery, useMutation,  gql } from '@apollo/client';
//import { ScreenWidth } from 'react-native-elements/dist/helpers';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

const CREATE_REQUEST = gql`
mutation createRequestItem($requestedItemId: ID!, $groupId: ID){
  createRequestItem(requestedItemId: $requestedItemId, groupId: $groupId) {
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
    groupId
  }
}`;

  const GET_USER = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      avatar
      username
      ratingSum
      totalRatings
      reviews {
        user {
          username
          avatar
        }
        date
        rating
        comment
      }
    }
  }`;

  

/* 2. Get the param */
function GeneralDetailsScreen ({ route, navigation }) {
  const [createRequest] = useMutation(CREATE_REQUEST);
  
  const { userId, itemID, title, sort, des, method, image } = route.params;
  const { data, error, loading } = useQuery(GET_USER, {variables: {id: userId}});
  const [maxstars, setMaxstars] = useState([1, 2, 3, 4, 5]);
  const naviagation = useNavigation();
  
  // const renderImage = ({ item }) => (
  //   <SafeAreaView style = {{flex:1, flexDirection: 'row'}}>
  //     <Image 
  //     style={{flexDirection: 'row', width: 60, height: 60,  }}
  //     source={item.source}/>
  //   </SafeAreaView> 
  // );
  console.log(data, loading, error);

  const handleRequest = () => {
    console.log('request pressed');
    createRequest({ variables: { requestedItemId: itemID, groupId: null } });
    naviagation.navigate('Notification',{ screen: 'requesting' });
    
  };

  const renderComment = ({ item }) => (
    //console.log(this.props.navigation);
    
    <View style = {{
      width:"90%", 
      borderColor: colors.mono_60,
      borderWidth:1,
      backgroundColor: colors.mono_40, 
      alignSelf:'center', 
      marginVertical: ScreenWidth*0.02, 
      height: ScreenWidth*0.3, 
      borderRadius: ScreenWidth*0.02,
      }}>
      <View style = {{flexDirection:'row', margin: ScreenWidth*0.02, alignItems:'center'}}>
        <Image
          style = {{height: ScreenWidth*0.06, width: ScreenWidth*0.06}}
          source = {{uri: `http://swappy.ngrok.io/images/${item.user.avatar}`}}
          />
        <View style ={{left: ScreenWidth*0.01,}}>
          <Text style = {{fontSize:13, color: colors.mono_100}}>{item.user.username}</Text>
          <Text style = {{fontSize:8, color: colors.mono_80}}>{item.date}</Text>
        </View>  
        
      </View>
      <View style = {{flexDirection:'row', left: ScreenWidth*0.02}}>
        {
            maxstars.map((itemD, index)=>{
              return(
                <Image 
                  source = {Math.round(item.rating)>=itemD? require('../../assets/personal/star_full.png') :  require('../../assets/personal/star_empty.png')}
                  style = {{height: ScreenHeight*0.015, width:ScreenHeight*0.015}}/>
              );
            })
        }
        </View>
        <Text style = {{left: ScreenWidth*0.01, color: colors.mono_100}}> {item.comment}</Text>
    </View>
    
  );
  
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    
    return (
    <Portal.Host>
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
              <Text style = {{right: "15%", fontSize: 20, color: colors.function_100}}>{title}</Text>
          </View>
        </View>

        <TouchableOpacity
            onPress = {showDialog}
            style = {{height:ScreenWidth*0.1, backgroundColor:colors.mono_40, alignSelf:'center'}}>
            <Text style = {{alignSelf:'center', fontSize: ScreenWidth*0.05, color: colors.mono_80}}>{data? data.getUserById.username : ''}</Text>
        </TouchableOpacity>

        <Portal>
          <Dialog 
            visible={visible} 
            onDismiss={hideDialog} 
            style = {{
              marginTop : ScreenHeight*0.3,
              height: ScreenHeight*0.7, 
              marginLeft:0, 
              //alignItems:'center', 
              width: ScreenWidth,
              borderTopLeftRadius: ScreenWidth*0.1, 
              borderTopRightRadius: ScreenWidth*0.1,
              backgroundColor: colors.mono_40}}>
                { data ? (
          <>
            <Image
              style = {{marginTop: ScreenHeight*0.05, marginLeft: ScreenWidth*0.09, height: ScreenWidth*0.3, width: ScreenWidth*0.3, borderRadius: ScreenWidth*0.15}}
              source = {{uri: `http://swappy.ngrok.io/images/${data.getUserById.avatar}`}}/>
            <Text style = {{marginTop: ScreenHeight*0.02, color: colors.function_100, fontWeight:'bold', fontSize: ScreenWidth*0.05, marginLeft: ScreenWidth*0.09}}>{data.getUserById.username}</Text>
            <View style = {{flexDirection:'row', width: ScreenWidth, height: ScreenHeight*0.02, marginTop: ScreenHeight*0.01, alignItems:'center'}}>
              <View style = {{width: ScreenWidth*0.09}}></View>
              <Text style = {{color:colors.function_100}}>{(data.getUserById.totalRatings == 0 ? 0 : (data.getUserById.ratingSum / data.getUserById.totalRatings))} </Text>
              {
                  maxstars.map((item, index)=>{
                    return(
                      <Image 
                        source = {Math.round(data.getUserById.ratingSum / data.getUserById.totalRatings)>=item? require('../../assets/personal/star_full.png') :  require('../../assets/personal/star_empty.png')}
                        style = {{height: ScreenHeight*0.015, width:ScreenHeight*0.015}}/>
                    );
                  })
              }
            </View>
            <View style = {styles.line}></View>
           
            <FlatList  
                data={data.getUserById.reviews}
                renderItem={renderComment}
                keyExtractor={item => item.id}/>
            </> ) : <Text>loading ...</Text>}
          </Dialog>
        </Portal>
        
        
        
        <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
            <Image
              style = {{flex: 5, height: "50%", width: "80%", marginBottom: 10}}
              source = {image? {uri: `http://swappy.ngrok.io/images/${image}`} : require('../../assets/general/商品呈現.png')}
            />
            <View style = {{height: ScreenWidth*0.07, flexDirection: 'row'}}>
              <View style = {styles.margin}></View>
              <TouchableOpacity
                onPress = {()=>navigation.navigate("MessageDetail", {message: [], nameShow : person_star_comment.personName})}
                style = {styles.margin}>
                <Image
                  style = {{height: ScreenWidth*0.07, width:ScreenWidth*0.07}}
                  source = {require("../../assets/general&group/message.png")}/>
              </TouchableOpacity>
              <View style = {{width: ScreenWidth*0.8}}></View>
            </View>
           
            <View style = {styles.line}></View>
            
            <View style = {{flex: 4.4, width: "100%"}}>
              <View style = {{flex: 0.5,flexDirection: 'row'}}></View>
              <View style = {{flex: 1,flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>交付方式 </Text>
                <Text>{method == 2 || method == 3? '面交' : ''}{method == 3? "/": ""}{method == 1 || method == 3? '寄送' : ''}</Text>
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
                        source = {require('../../assets/general/request.png')}/>
                  </TouchableOpacity>
              </View>
                           
            </View>
            
        </View>
        
      </View>
    </Portal.Host>
  );
  // }

}

export default GeneralDetailsScreen;

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
  button:{
    width: "10%", 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent:'center'},
  line:{
    height: 2,
    backgroundColor: colors.mono_60,
    width: "82%",
    marginTop: ScreenHeight*0.01,
    alignSelf: 'center',
  },
  buttonImage :{
    width: 23, 
    height:20.97, 
    backgroundColor:'transparent'},
  textT:{
    color: colors.function_100,
  },
  margin: { 
    width: ScreenWidth*0.1, 
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