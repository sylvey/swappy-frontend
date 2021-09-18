import React, {useEffect, useState} from 'react';
import { useQuery, useMutation,  gql } from '@apollo/client';
var dateFormat = require("dateformat");

import { View,
       Text,
       Button, 
       Image, 
       FlatList, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       StyleSheet,
       //KeyboardAwareScrollView,
       KeyboardAvoidingView, 
       Dimensions,
       TextInput } from "react-native";


import colors from '../../config/colors';

import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer';


let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;

const QUERY_POST  = gql`
query getPost($id: ID!){
  getPost(id: $id) {
    title
    description
    author {
      username
    }
    time
    comments {
      user {
        username
      }
      comment
      time
    }
  }
}`;

const ADD_COMMENT = gql`
mutation postComment($id: ID!, $comment: String!, $time: String) {
  postComment(postId: $id, comment: $comment, time: $time)
}`;

const COLLECT_POST = gql`
mutation addToCollection($id: ID!) {
  addToCollection(postId: $id)
}`;

const MainDetail = ({ route, navigation }) =>{
  
  const [comment, setComment] = useState('');
  const [date, setDate] = useState("6/22/2021, 2:59:00 PM");
  const [comments, setComments] = useState([
    {profile: require('../../assets/Social/profileDefault.png'), name: "sherry", content: "i agree", date: "6/22/2021, 2:59:00 PM"},
    {profile: require('../../assets/Social/profileDefault.png'), name: "sherry", content: "i agree", date: "6/22/2021, 2:59:00 PM"},
    {profile: require('../../assets/Social/profileDefault.png'), name: "sherry", content: "i agree", date: "6/22/2021, 2:59:00 PM"},
    {profile: require('../../assets/Social/profileDefault.png'), name: "sherry", content: "i agree", date: "6/22/2021, 2:59:00 PM"},
    {profile: require('../../assets/Social/profileDefault.png'), name: "sherry", content: "i agree", date: "6/22/2021, 2:59:00 PM"}, ]);

  const { id, title, profile, person, post, hideName, description, time } = route.params;
  console.log(id, title, profile, person, post, hideName, description);

  const { data, error, loading } = useQuery(QUERY_POST, {variables: {id:id}});
  const [addComment] = useMutation(ADD_COMMENT, 
    {
      refetchQueries: [ 
      {
        query: QUERY_POST,
        variables: { id : id }
      }]
    });
  const [addToCollection] = useMutation(COLLECT_POST);
 

  const handleAddComment = () => {
    const time = new Date();
    const formatedTime = dateFormat(time, "m/dd/yyyy, h:MM:ss TT");

    addComment({ variables: {id: id, comment: comment, time: formatedTime}});
    setComment('');
  }

  const handleNavigate = ()=>{
    navigation.navigate('My Collection');
  }
  const handleCollect = () => {
    addToCollection({variables: {id: id}});
    
    
    handleNavigate();
  }

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
          source = {require('../../assets/Social/profileDefault.png')}
          />
        <View style ={{left: ScreenWidth*0.01,}}>
          <Text style = {{fontSize:13, color: colors.mono_100}}>{item.user? item.user.username : "匿名"}</Text>
          <Text style = {{fontSize:8, color: colors.mono_80}}>{item.time ? item.time : 'time hidden'}</Text>
        </View>
        
        
      </View>
        <Text style = {{left: ScreenWidth*0.01, color: colors.mono_100}}> {item.comment}</Text>
    </View>
    
  );

  return (
    <View
       //behavior= 'padding'
       style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center'}}
       >
       <View style = {{flexDirection: 'row', height: "7%", width:"100%", backgroundColor: colors.mono_40}}>
        <TouchableOpacity
          style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
          onPress = {()=>navigation.goBack()}
          >
          <Image 
            style = {{height: "25%", width: "25%"}}
            source = {profile? {uri:profile} : require('../../assets/manyneed/xmark.png')}/> 
            {/*sholud be hideName? but for there are no profile photo*/}
        </TouchableOpacity>

        <View
          style ={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
            <Text style = {{right: "15%", fontSize: 20, fontWeight: 'bold', color: colors.mono_100}}>{title}</Text>
            
        </View>
      </View>
      <KeyboardAvoidingView
        style = {{ alignItems: 'center', backgroundColor: colors.mono_40}}
        behavior="padding"
        enabled>
      <ScrollView style= {{flex: 1, backgroundColor: colors.mono_40, width: "100%"}}>
        
          

          <View 
              style= {{backgroundColor: 'red', backgroundColor: colors.mono_40, marginBottom:20, alignItems:'center'}}
              //contentContainerStyle = {{}}
              >
              <View style ={{ flexDirection: 'row', width:ScreenWidth*0.9, alignItems:'center'}}>
                <Image
                  style = {{height: ScreenWidth*0.09, width: ScreenWidth*0.09}}
                  source = {require('../../assets/Social/profileDefault.png')}/>
                <View style = {{left: ScreenWidth*0.01,}}>
                  <Text style = {{fontSize:15, color: colors.mono_100}}>{hideName? "匿名" : person}</Text>
                  <Text style = {{fontSize:10, color: colors.mono_80}}>{time}</Text>
                </View>
                
              </View>
              <View style = {{  backgroundColor:'transparent', width:ScreenWidth*0.9,}}>
                <Text style = {{flex: 1, color: colors.mono_100}}>{post}</Text>
              </View>
          
          
          
          </View>

      
          <View style = {styles.line}></View>
          { data ? (<FlatList 
            
            data={data.getPost.comments}
            renderItem={renderComment}
            keyExtractor={item => item.id}/> ) : <Text>loading comments... </Text>
          }

          <View style = {{height: ScreenHeight*0.13}}></View>
        
        
      </ScrollView>
      <View
         //behavior = 'padding'
         
         style = {styles.commentC}>
              <View style = {styles.comment}>
                  <TextInput
                      placeholder="comment"
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
              
              <TouchableOpacity
                onPress = {()=>handleCollect()}
                style ={{ 
                  flex:1,
                  width: "7%", 
                  height: "100%",
                  justifyContent:'center',
                  alignItems:'center'}}
              >
                <Image
                  style ={{
                  
                    width: ScreenWidth*0.06, 
                    height: ScreenWidth*0.06,
                    }} 
                  source = {require('../../assets/Social/收藏.png')}/>
              </TouchableOpacity>
          </View> 
        </KeyboardAvoidingView>
    </View>
  );
  
}

export default MainDetail;

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.mono_60,
    width: "90%",
    alignSelf:"center",
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
    paddingTop: 23
  },
  comment: {
    flexDirection:'row',
    //flex:8,
    backgroundColor:colors.mono_40,
    borderRadius:ScreenWidth*0.02,
    height:ScreenWidth*0.1,
    width:"80%",
    borderWidth:1,
    borderColor: colors.function_100,

    marginLeft:"5%",
    //position:'absolute',
    bottom: ScreenHeight * 0.01,
  },
  commentC: {
    flexDirection:'row',
    //flex:1,
    backgroundColor: colors.mono_40,
    height:"10%",
    width:"100%",
    alignItems:'center',
    // position:'absolute',
    bottom: ScreenHeight * 0.1,
    justifyContent: "flex-start"
  },
  buttonText: {
    //color: '#fff',
    fontSize: 15,
    left: 5,
    fontWeight: 'bold',
  },
});