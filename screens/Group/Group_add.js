import { styleSheets } from 'min-document';
import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View, 
    TextInput,
    FlatList,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity} from 'react-native';
import * as SQLite from "expo-sqlite";
import { useNavigation } from '@react-navigation/core';
import colors from '../../config/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useMutation,  gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;

const ADD_GROUP = gql`
  mutation addGroup($title: String!, $description: String!, $tags: [String]!){
    addGroup(title: $title, description: $description, tags: $tags) {
      id
      title
      description
      tags
    }
  }`;

function Group_ADD () {

  const [addGroup, { data, error, loading }] = useMutation(ADD_GROUP);

  const [Gname, setGname] = useState("");
  const [tag, setTag] = useState("");
  const [des, setDes] = useState("");
  const [tagList, setTagList] = useState([]);
  
  const navigation = useNavigation();


  const handlesubmit =() =>{
    console.log(tagList);
    addGroup({variables: {title: Gname, description: des, tags: tagList}})
    navigation.navigate('Home')
  } 

  const handleAddTag = () =>{
      const newTag = tag;
      setTagList([...tagList, newTag]);
      //setTagList([...tagList, {name: newTag}]);
      setTag('');
  }

  const handleDelete = (item) =>{
    let array = tagList;
    const index = array.indexOf(item);
    
    if (index > -1) {
      array.splice(index, 1);
    }
    setTagList([...array]);
  }

  

  
    //const{ navigate } = this.props.navigation; 
  return(
    
    <View style={{flex:1, flexDirection: 'column'}}>
      <KeyboardAwareScrollView>
      {/* <ScrollView> */}
      <View style ={styles.textContainer}>
          <Text style={styles.text}>群組名稱</Text>
      </View>
      <View style ={styles.textInputContainer}>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setGname(text)}
            value = {Gname}/>
      </View>
      <View style ={styles.textContainer}>
        <Text style={styles.text}>說明</Text>
      </View>

      <View style ={styles.textInputContainer2}>
      <TextInput
          style={styles.input}
          multiline = {true}
          onChangeText={(text) => setDes(text)}
          value = {des}/>
      </View>

      <View style ={styles.textContainer}>
        <Text style={styles.text}>物品品項(按勾新增物品)</Text>
      </View>

      <View style = {styles.inputContainer}>
           <TextInput
             style={styles.input2}
             placeholderTextColor = {colors.function_100}
             onChangeText={(text) => setTag(text)}
             value={tag} />   
           <TouchableOpacity
             onPress = {()=>handleAddTag()}
             style ={{ 
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

       
       <ScrollView 
          horizontal={true} 
          style={{flexDirection: 'row', marginTop: ScreenWidth*0.05}}
          >
          {
            
            tagList.map((item, index)=>{
              return(
                <View 
                  style = {{
                    flexDirection:'row',
                    marginHorizontal: ScreenWidth*0.05,
                    marginVertical:ScreenWidth*0.03,
                    backgroundColor: colors.function_100,
                    width: ScreenWidth*0.3,
                    height: ScreenWidth*0.1,
                    alignItems:'center',
                    justifyContent: 'center',
                    borderRadius: ScreenWidth*0.02,
                     }}>
                  <Text style = {{flex:5, color: colors.mono_40, fontWeight: '900', marginLeft: "5%"}}>{item}</Text>
                  <TouchableOpacity
                    onPress={()=>handleDelete(item)}
                    style = {{flex:1}}
                    title = 'upload'>
                    <Image
                      style = {{height: ScreenWidth*0.02, width: ScreenWidth*0.02}} 
                      source ={require('../../assets/group/delete.png')}/>
                  </TouchableOpacity>
                </View>
              );
            })
          }
       </ScrollView>  
       
       <View style = {styles.uploadContainer}>
          <TouchableOpacity
              title = 'Submit'
              onPress={handlesubmit}
              style = {styles.item}>
              <Image
                style = {{height: 70, width:70,}} 
                source = {require('../../assets/breakAway/upload.png')}/>
          </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
      
     
      
      {/* <Button
          title = 'Go to home screen'
          onPress={() => navigate('Home')}/> */}
    </View>
    
  )


}

export default Group_ADD;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginHorizontal:"5%",
    height: "100%",
    color: colors.mono_80,
    borderColor: colors.mono_80,
    borderWidth: 1,
    textAlignVertical:'top',
  },
  input2: {
    //top: 14,
    color: colors.mono_80,
    left: 10,
    height: "100%",
    width: "90%",
    borderWidth: 0,
  },
  uploadContainer:{
    flex:1,
    justifyContent:'center',
    height:"100%",
    backgroundColor:"transparent",  
    alignItems:'center',
    justifyContent:'center',  
    paddingTop: "35%"  
  },
  
  item: {
    //position: 'absolute',
    //bottom: 60,
    height:70,
    width:70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: "5%",
    fontWeight: 'bold',
    color: colors.mono_80,
  },
  inputContainer:{
    flex:1.3,
    marginLeft:"5%",
    flexDirection: 'row',
    //margin:10,
    height: "100%",
    width: "90%",
    borderWidth: 1,
    //borderRadius:6,
    borderColor: colors.mono_80,
    backgroundColor: 'transparent',
  },
  textContainer:{
    flex:1,
    marginVertical: 10,
    justifyContent:'center',
    //alignItems:'center',
    backgroundColor:'transparent',      
  },
  textInputContainer:{
    flex:1.3,
    alignItems:'center',
    //justifyContent:'center',
    flexDirection:'row',
    height:"100%",
    width: "100%",
    backgroundColor: "transparent",      
  },
  textInputContainer2:{
    flex:2,
    alignItems:'center',
    
    //justifyContent:'center',
    flexDirection:'row',
    height: ScreenWidth*0.5,
    width: "100%",
    backgroundColor: "transparent",      
  },

});