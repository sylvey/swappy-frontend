import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object
import { Paragraph, Dialog, Portal } from 'react-native-paper';
import GeneralItems from '../../Data/GeneralItems';



import { View,
        Platform,
       Text,
       Button, 
       Image, 
       TextInput,
       FlatList, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       StyleSheet,
       Dimensions } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
import Notification_requesting from './Notification_requesting';

import { useQuery, useMutation,  gql } from '@apollo/client';

const REMOVE_REQUEST = gql`
  mutation removeRequest($id: ID!) {
    removeRequest(id: $id)
  }
`;

// const MY_GENERAL_ITEMS = gql`
// query myGeneralItems{
//   myGeneralItems {
//     id
//     title
//     category
//     image
//     exchangeMethod
//     description
//   }
// }`;

//TODO: query my items from a group

const BATCHED_QUERY = gql`
query myGeneralItemsAndGetRequest ($id: ID!){
  myGeneralItems {
    id
    title
    category
    image
    exchangeMethod
    description
  } getRequest(id: $id) {
      requestersItem {
        title
        image
      }
      groupId
    }
}`;

const GET_GROUP_ITEMS = gql`
query getMyGroupItemsAndUsersWishTags($userId:ID!, $groupId: ID!) {
  getMyGroupItems(groupId: $groupId) {
    id
    title
    category
    image
    exchangeMethod
    description
  } getUsersWishTags(userId: $userId, groupId:$groupId) 
}`;

const UPDATE_REQUEST = gql`
mutation updateRequestersItems($groupId: ID, $itemId: ID!, $requestId: ID!) {
  updateRequestersItem(groupId: $groupId, itemId: $itemId, requestId: $requestId)
}`;

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;



function Notification_waitingDetail ({ route }) {

  const { id, requestFor_user, mything_title, mything_source, requestFor_title, requestFor_source } = route.params;
  console.log(id);
  const [removeRequest] = useMutation(REMOVE_REQUEST);
  const [updateRequest] = useMutation(UPDATE_REQUEST);
  const { data: batchedData  } = useQuery(BATCHED_QUERY, {variables: { id: id }, pollInterval: 500});
  console.log(batchedData);
  const groupId = batchedData?.getRequest?.groupId;
  const { data: groupData } = useQuery(GET_GROUP_ITEMS, {skip: groupId==null, variables: { userId: requestFor_user, groupId: groupId }});
  
  
  // render(){  
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    
    const navigation = useNavigation();

    const handleDelete = () =>{
      removeRequest({variables: {id: id}});
      

      navigation.navigate("Notification");

    };

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
        setImage(result.uri)
    }; 

    const renderItem = ({ item }) => (
      <SafeAreaView style={styles.boxContainer}>
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.item} // if item.tag is in other users wish tags 
            onPress={
              () => {
                setSelectedImage(item.image);
                setSelectedTitle(item.title);
                // console.log(selectedImage);
                // console.log(selectedTitle);
                // console.log(groupId);
                updateRequest({variables: {groupId: groupId, itemId: item.id, requestId: id}})
                hideDialog();
              }
              
              //() => navigation.navigate('NotificationWaitingDetail', {itemID: item.id, title: item.title, sort: item.category, des: item.description, method: item.exchangeMethod, image: item.image})
              }>
              <Image
                source =  {item.image? {uri: `http://swappy.ngrok.io/images/${item.image}`} : require('../../assets/general/商品呈現.png')}
                style ={{height: ScreenHeight*0.13, width: ScreenHeight*0.13,}}/>

              {/* 如果是group，又有在對方的wishlist裡面 */}
              { (groupData?.getUsersWishTags != null && groupData?.getUsersWishTags[item.category]) ? (
              <View style = {{ backgroundColor:colors.function_100, width: '100%'}}>
                  <Text style={styles.titleMatched}>{item.title}</Text>
                  <Text style = {{marginLeft: 16, marginTop: "5%", color: colors.function_60}}>#{item.category}</Text>
              </View>  ) : 
              <View style = {{ backgroundColor:'transparent', width: '100%'}}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style = {{marginLeft: 16, marginTop: "5%", color: colors.function_100}}>#{item.category}</Text>
              </View> 
              } 
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    //pop-up related definition
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <Portal.Host>
          <View style = {{flex:1, alignItems: 'center'}}>
          {batchedData ? ( <>
            <View style = {{flex: 2, flexDirection:'row', backgroundColor: colors.mono_40, width: "100%", justifyContent:'center', }}>
                <View style = {{flex:1}}></View>
                <View style = {styles.itemBox}>
                    <Image
                        style={styles.image}
                        source = {requestFor_source? {uri: `http://swappy.ngrok.io/images/${requestFor_source}`} : require('../../assets/general/商品呈現.png')}/>

                      <View style ={styles.titleTag}>
                        <Text style = {styles.tagText}>對方的物品</Text>
                      </View>
                      <View style ={styles.titleTagB}>
                        <Text style = {styles.titleText}>{requestFor_title}</Text>
                      </View>
                </View>

                <View style = {styles.itemBox}>  
                {
                      batchedData.getRequest.requestersItem == null? 
                      (
                          <View style= {styles.image}>
                              <TouchableOpacity 
                                  style={{height:"100%", width:"100%"}}
                                  onPress={showDialog}
                              >
                                  <Image
                                      style={{ height:"100%", width:"100%" }}
                                      source={image == null ? require("../../assets/notification/點擊上傳圖片.png"): {uri: image}}/>
                              </TouchableOpacity>
                              <Portal>
                                <Dialog visible={visible} onDismiss={hideDialog} style = {{marginTop : ScreenHeight*0.2, height: ScreenHeight*0.8, marginLeft:0, alignItems:'center', width: ScreenWidth, backgroundColor: colors.mono_40}}>
                                  <Dialog.Title style ={{fontWeight: 'bold', fontSize: ScreenWidth*0.06, color: colors.function_100}}>上傳物件選取</Dialog.Title>
                                  { (!batchedData?.getRequest.groupId || (batchedData?.getRequest.groupId && groupData)) ? (
                                  <FlatList
                                   contentContainerStyle = {{alignItems:'center'}}
                                   // TODO: is group? groupdata else data 
                                   data={ (batchedData?.getRequest?.groupId  == null) ? batchedData.myGeneralItems : groupData.getMyGroupItems }
                                   renderItem={renderItem}
                                  /> ) : <Text>loading ...</Text> 
                                    
                                  }
                                </Dialog>
                              </Portal>

                              <TextInput
                                  //style={styles.input}
                                  placeholderTextColor = {colors.function_100}
                                  onChangeText={(text) => setTitle(text)}
                                  value={title} /> 
                    
                          </View>

                          
                      ): 
                      (
                        <>
                            <Image
                            style={styles.image}
                            source = {{uri: `http://swappy.ngrok.io/images/${batchedData.getRequest.requestersItem.image}`} }/> 
                            {/* data.getRequest.requestersItem.image */}

                          <View style ={styles.titleTag}>
                            <Text style = {styles.tagText}>你的物品</Text>
                          </View>
                          <View style ={styles.titleTagB}>
                            <Text style = {styles.titleText}>{batchedData.getRequest.requestersItem.title}</Text>
                          </View>
                        </>
                          // <View style = {styles.image}>
                          // <Image
                          //     source = { {uri: `http://swappy.ngrok.io/images/${selectedImage}`}}/>
                          //     <Text>{selectedTitle}</Text>
                          // </View>
                      )
                    }
                  
                  {/* <View style ={styles.titleTag}>
                    <Text style = {styles.tagText}>你的物品</Text>
                  </View> */}
                  {/* <View style ={styles.titleTagB}>
                    <Text style = {styles.titleText}>{mythingTitle}</Text>
                  </View> */}
                  
                </View>                
                <View style = {{flex:1}}></View>

            </View>
            
            <Image 
                style = {{position:'absolute', top: ScreenWidth*1.08, height:ScreenWidth*0.1, width: ScreenWidth*0.1}}
                source = {require('../../assets/notification/漏斗.png')}/>
            <Image 
                style = {{position:'absolute', top: ScreenWidth*1.2, height:ScreenWidth*0.1748, width: ScreenWidth*0.608}}
                source = {require('../../assets/notification/等待回應中.png')}/>

              <View style = {{position:'absolute', top:ScreenWidth*1.4, alignItems:'center', justifyContent: 'center'}}>
                  <TouchableOpacity
                      onPress = {handleDelete}>
                      <Text style = {{color : colors.warning_100}}>撤回</Text>
                  </TouchableOpacity>
              </View>
              </>) : <Text>loading ...</Text>
            }
                
          </View>
        </Portal.Host>
    );
  // }

}

export default Notification_waitingDetail;

const styles = StyleSheet.create({
  margin: {
    position: 'relative',
    height: "10%",
    backgroundColor: colors.mono_40,
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
  item: {
    flexDirection:'row',
    backgroundColor: 'transparent',
    //padding: 20,
    height: "100%",
    //marginVertical: 8,
    //marginHorizontal: 16,
  },
  title: {
    marginLeft: 16,
    fontSize: 33,
    color: colors.mono_100,
    fontWeight: '900',
  },
  titleMatched: {
    marginLeft: 16,
    color: colors.mono_40,
    fontSize: 33,
    fontWeight: '900',
  },
  buttons: {
    //flexDirection: 'row'
    flex:1,
    backgroundColor: 'transparent',
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  itemBox: {
    flex:5,
    alignItems:'center',
    //justifyContent: 'center',
    //backgroundColor:'yellow',
},
image: {
    width: ScreenWidth*0.4, 
    height: ScreenWidth*0.4,
    top:  ScreenWidth*0.44,
},
titleTag: {
    top: ScreenWidth*0.4,
    position: 'absolute',
    alignItems:'center',
    justifyContent: 'center',
    width: ScreenWidth*0.25,
    backgroundColor: colors.function_100,
    height: ScreenWidth*0.08,
    borderRadius: ScreenWidth*0.02,
    //marginBottom: -ScreenWidth*0.03,
    
},
titleTagB: {
    top: ScreenWidth*0.84,
    position: 'absolute',
    alignItems:'center',
    justifyContent: 'center',
    width: ScreenWidth*0.25,
    backgroundColor: 'transparent',
    height: ScreenWidth*0.06,
    //marginBottom: -ScreenWidth*0.03,
    
},
tagText: {
    fontSize: ScreenWidth*0.04,
    color: colors.mono_40,
},
titleText:{
    color: colors.function_100,
    fontSize: ScreenWidth*0.04,
    fontWeight: 'bold',
}
});