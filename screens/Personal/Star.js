import React, {useEffect, useState} from 'react';
var dateFormat = require("dateformat");

import { View,
       Text,
       Button, 
       Image, 
       TextInput, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       KeyboardAvoidingView,
       StyleSheet, 
       Dimensions} from "react-native";
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
//import Notification_requesting from './Notification_requesting';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation, gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
//const windowHeight = useWindowDimensions().height;

const UPDATE_RATING_AND_REVIEW = gql`
mutation updateRatingAndReviews($requestId: ID!, $userId: ID!, $rating: Float!, $comment: String!, $date: String!) {
    updateRatingAndReviews(
      requestId: $requestId,
      userId: $userId, input: {
      rating: $rating,
      comment: $comment,
      date: $date
    })
  } `;

/* 2. Get the param */
function Star ({ route, navigation }) {

  
  // render(){  
    const { myUsername, otherGuyId, id, mythingImage, requestForImage, requestForTitle } = route.params;
    const [maxStar, setMaxStar] = useState([1, 2, 3, 4, 5]);
    const [star, setStar] = useState(0);
    const [description, setDescription] = useState("");

    const [updateRatingAndReviews, {data, loading, error}] = useMutation(UPDATE_RATING_AND_REVIEW);
    console.log(data, loading, error);

    const handlesubmit = () =>{
        const time = new Date();
        const formatedTime = dateFormat(time, "isoDate");

        updateRatingAndReviews({variables: {requestId: id, userId: otherGuyId, rating: star, comment: description, date: formatedTime}});
        navigation.navigate('Complete',{requestForImage: requestForImage, requestForTitle: requestForTitle});
    }
    
    return (
     
        <View 
            style = {{flex: 1, alignItems: 'center'}}>
            {/* contentContainerStyle ={{alignItems:'center'}} */}
            <KeyboardAvoidingView style={{height: ScreenHeight*0.4, alignItems: 'center', justifyContent: 'center'}}>
                <View style = {{flex:1.2, width:'100%', backgroundColor: 'transparent', width:"100%", alignItems:'center', justifyContent:'center'}}>
                    <Image
                        style ={{height:ScreenWidth*0.1, width: ScreenWidth*0.1}}
                        source = {require("../../assets/personal/禮物.png")}/>
                </View>  
                <View style = {{flex:1.2, backgroundColor: 'transparent', height: "100%", width: "100%", alignItems:'center',justifyContent:'center',marginTop:10,}}>
                    <Text style ={styles.text}>有任何想要給與換主的回饋嗎~</Text>
                    <Text style = {styles.text}>請在這裡寫下評價！</Text>
                </View>


                <View style ={{ flexDirection:'row', justifyContent:'center', width: "100%", alignItems:'center', height:ScreenWidth*0.4, marginTop:10}}>

                    <Image
                        style = {styles.image}
                        source = { {uri: `http://swappy.ngrok.io/images/${mythingImage}`}}/>

                    <Image
                        style = {styles.image}
                        source = { {uri: `http://swappy.ngrok.io/images/${requestForImage}`}}/>

                    <Image
                        style = {{position: 'absolute',top: ScreenWidth*0.16, height: ScreenWidth*0.08, width: ScreenWidth*0.08 }}
                        source = {require('../../assets/personal/交換.png')}/>

                </View>
                <View style = {styles.line}></View>
            </KeyboardAvoidingView>
            <KeyboardAwareScrollView style = {{width:"100%", height: "50%"}}>
                <View style = {{backgroundColor:'transparent',marginLeft:"5%", width:"95%", height:ScreenWidth*0.08, flexDirection:'row', marginTop:10,}} >
                    {
                        maxStar.map((item, index)=>{
                          return(
                            <TouchableOpacity
                                style = {{height: ScreenWidth*0.08, width:ScreenWidth*0.08}}
                                onPress = {()=>setStar(item)}>
                                <Image 
                                    source = {star>=item? require('../../assets/personal/star_full.png') :  require('../../assets/personal/star_empty.png')}
                                    style = {{height: ScreenWidth*0.08, width:ScreenWidth*0.08}}/>
                            </TouchableOpacity>
                          );
                        })
                    }
                </View>
                <View style = {{flex:3, backgroundColor:'transparent', height:"100%", width:"100%", marginTop:10}}>
                    <TextInput
                        style={styles.input}
                        //placeholder='second hand, not brandnew'
                        multiline = {true}
                        onChangeText={setDescription}
                        value = {description}/>
                </View>

                <View style = {{flex:2, alignItems:'center', height:'100%', width:"100%", backgroundColor:'transparent', marginTop:20}}>
                    <TouchableOpacity
                        style = {{height: ScreenWidth*0.12, width:ScreenWidth*0.3}}
                        onPress = {handlesubmit}
                        >
                        <Image 
                            source = {require('../../assets/personal/送出.png')}
                            style = {{height: ScreenWidth*0.12, width:ScreenWidth*0.3}}/>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView> 
            
        </View>
        
    
    );
  // }

}

export default Star;

const styles = StyleSheet.create({
    itemBox: {
        flex: 5,
        alignItems:'center'
    },
    image:{
        width: ScreenWidth*0.4,
        height: ScreenWidth*0.4,
        marginHorizontal: ScreenWidth*0.05,
    },
    text:{
        color: colors.mono_80,
        fontSize: ScreenWidth*0.035,
    },
    line:{
        height:2,
        marginTop:2,
        marginTop:10,
        backgroundColor: colors.mono_60,
        width: ScreenWidth*0.9,
        alignSelf:'center',
    },
    input:{
        marginHorizontal: "5%",
        height: 150,
        borderColor: colors.mono_60,
        borderWidth: 1,
        textAlignVertical: 'top',
    },

});