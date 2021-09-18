import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object


import { View,
        Platform,
       Text,
       Button, 
       Image, 
       FlatList, 
       SafeAreaView, 
       Dimensions,
       ScrollView, 
       TouchableOpacity,
       StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
import Notification_requesting from './Notification_requesting';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;


/* 2. Get the param */
function Notification_invitationDetail ({ route, navigation }) {

    
 

  
  
  // render(){  
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const { groupId, id, mything_id, mything_title, mything_source, mything_category, mything_description, mything_exchangeMethod, mything_userId,
      requestFor_id, requestFor_title, requestFor_category, requestFor_description, requestFor_exchangeMethod, requestFor_source, requestFor_userId } = route.params;
    
    console.log(groupId, id, mything_id, mything_title, mything_source, mything_category, mything_description, mything_exchangeMethod, mything_userId,
      requestFor_id, requestFor_title, requestFor_category, requestFor_description, requestFor_exchangeMethod, requestFor_source, requestFor_userId);
    const navigation1 = useNavigation();

    const handleDelete = () =>(
        <View></View>
    );

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
        setImage(result.uri)
    }; 

    const goToItemDetail = () => {
      //console.log('pressed!');
      //if groupId is null
      console.log(requestFor_exchangeMethod);
      if(groupId == null) {
        console.log(requestFor_exchangeMethod)
        navigation.navigate('GeneralDetail', {userId: requestFor_userId, itemID: requestFor_id, title: requestFor_title, sort: requestFor_category, des: requestFor_description, method: requestFor_exchangeMethod, image: requestFor_source});
      } else {
        console.log(requestFor_exchangeMethod)
        navigation.navigate('Group_itemDetail',{groupId: groupId, userId: requestFor_userId, itemId: requestFor_id, title: requestFor_title, dis: requestFor_description, method: requestFor_exchangeMethod, tagname: requestFor_category, image: requestFor_source});
      }
      
      //else groupdetail
    }

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

    return (
     
      <View style = {{flex:1, alignItems: 'center'}}>

          <View style = {{flex: 2, flexDirection:'row', backgroundColor: colors.mono_40, width: "100%", justifyContent:'center', }}>
                <View style = {{flex:1}}></View>
                
                  {
                    requestFor_title == null? 
                    (
                        <View style = {styles.itemBox}>
                            <Image 
                                source={require('../../assets/notification/對方尚未上傳圖片.png')}
                                style={styles.image}/>
                            <View style ={styles.titleTag}>
                              <Text style = {styles.tagText}>對方的物品</Text>
                            </View>
                            <View style ={styles.titleTagB}>
                              <Text style = {styles.titleText}>對方尚未上傳物品</Text>
                            </View>
                        </View>
                    ): 
                    (

                        <View style = {styles.itemBox}>
                          <TouchableOpacity 
                                  style={{height:"100%", width:"100%"}}
                                  onPress={goToItemDetail}
                              >
                          <Image
                              style={styles.image}
                              source = {{uri: `http://swappy.ngrok.io/images/${requestFor_source}`}}/>
                            </TouchableOpacity>
                          <View style ={styles.titleTag}>
                            <Text style = {styles.tagText}>對方的物品</Text>
                          </View>
                          <View style ={styles.titleTagB}>
                            <Text style = {styles.titleText}>{requestFor_title}</Text>
                          </View>
                              {/* <Text>{requestFor_title}</Text> */}
                        </View>
                    )
                  }
                

                <View style = {styles.itemBox}>
                  {/* <Text>你的物品</Text> */}
                  <Image
                    style={styles.image}
                    source = {mything_source? {uri: `http://swappy.ngrok.io/images/${mything_source}`} : require('../../assets/general/商品呈現.png')}/>
                  <View style ={styles.titleTag}>
                        <Text style = {styles.tagText}>你的物品</Text>
                  </View>
                  <View style ={styles.titleTagB}>
                        <Text style = {styles.titleText}>{mything_title}</Text>
                  </View>
                  {/* <Text>{mything_title}</Text> */}
                </View>

                <View style = {{flex:1}}></View>
            </View>

            <Image 
                style = {{position:'absolute', top: ScreenWidth*1.08, height:ScreenWidth*0.1, width: ScreenWidth*0.1}}
                source = {require('../../assets/notification/漏斗.png')}/>
            <Image 
                style = {{position:'absolute', top: ScreenWidth*1.2, height:ScreenWidth*0.1748, width: ScreenWidth*0.608}}
                source = {require('../../assets/notification/選擇要不要交換.png')}/>


            {/* <View style = {{flex: 1, alignItems:'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress = {handleDelete}>
                    <Text style = {{color : colors.warning_100}}>撤回</Text>
                </TouchableOpacity>
            </View> */}
            
              
         </View>
    );
  // }

}

export default Notification_invitationDetail;

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
    fontSize: 33,
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
    //flex:5,
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