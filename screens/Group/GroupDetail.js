import { styleSheets } from 'min-document';
import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View, 
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Dimensions} from 'react-native';
import colors from '../../config/colors';
//import GroupItems from '../../Data/GroupItems';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;

import { useQuery,  gql } from '@apollo/client';

const RENDER_GROUP_DETAIL = gql`
query filterMatchingGroupItems($id: ID!) {
  filterMatchingGroupItems(id: $id) 
}`;
  // query getGroup($id: ID!) {
  //   getGroup(id: $id) {
  //     groupItems{
  //       description
  //       tag
  //       exchangeMethod
  //       image
  //     }
  //   }

 


function GroupDetailsScreen ({route, navigation}) {

  const { title, items, post, discription, tags, id } = route.params;
  console.log(id);

  const { data, error, loading } = useQuery(RENDER_GROUP_DETAIL, {variables: { id: id }, pollInterval: 500});
  const handleback =() =>{
    navigation.goBack()
  } 
  console.log(data);
  console.log(error);
  console.log(loading);

  const renderItem = ({ item }) => (
    //console.log(this.props.navigation);
    <TouchableOpacity 
      style={styles.tag}>
      <View>
        <Text style={styles.buttonText}>{item}</Text>
        </View>    
      
    </TouchableOpacity>
  );
  

  const renderPostN = ({ item }) => {
    //console.log(item._id);
    return (
    <TouchableOpacity 
      style={styles.itemN} 
      onPress={() => {navigation.navigate('Group_itemDetail',{userId: item.owner._id, groupId: id, itemId: item._id, title: item.title, dis: item.description, method: item.exchangeMethod, tagname: item.category, image: item.image})}}>    
      <Image
        style ={{height: ScreenWidth*0.2, width: ScreenWidth*0.2}}
        source = {item.image? {uri: `http://swappy.ngrok.io/images/${item.image}`} : require('../../assets/general/商品呈現.png')}/>
      <View style ={{marginLeft:3, height:'100%', width:"75%", backgroundColor:'transparent'}}>
        <Text style={{position:'absolute', top: 0 , color: colors.mono_100, fontWeight:'bold', fontSize:ScreenWidth*0.04}}>{item.title}</Text>
        <Text style={{position:'absolute', top: ScreenWidth*0.05, color: colors.mono_100, fontWeight:'normal', fontSize:ScreenWidth*0.03}}>{item.description}</Text>
        <Text style={{position:'absolute', top: ScreenWidth*0.15, color: colors.function_100, fontSize:ScreenWidth*0.03}}>#{item.category}</Text>
      </View>
    </TouchableOpacity>
  )};

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => {navigation.navigate('Group_itemDetail',{userId: item.owner._id, groupId: id, itemId: item._id, title: item.title, dis: item.description, method: item.exchangeMethod, tagname: item.category, image: item.image})}}>    
      <Image
        style ={{height: ScreenWidth*0.2, width: ScreenWidth*0.2}}
        source = {item.image? {uri: `http://swappy.ngrok.io/images/${item.image}`}: require('../../assets/general/商品呈現.png')}/>
      
      <View style ={{marginLeft:3, height:'100%', width:"75%", backgroundColor:'transparent'}}>
        <Text style={{position:'absolute', top: 0, color: colors.mono_40, fontWeight:'bold', fontSize:ScreenWidth*0.04}}>{item.title}</Text>
        <Text style={{position:'absolute', top: ScreenWidth*0.05, color: colors.mono_100, fontWeight:'normal', fontSize:ScreenWidth*0.03}}>{item.description}</Text>
        <Text style={{position:'absolute', top: ScreenWidth*0.15, color: colors.function_60, fontSize:ScreenWidth*0.03}}>#{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  
    // const{ navigate } = this.props.navigation;
    // const { title, items, post, discription } = this.props.route.params

    return(
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
              <Text style = {{ fontSize: 25, color: colors.function_100}}>{title}</Text>
          </View>

          <TouchableOpacity
            style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
            onPress = {()=>navigation.navigate('GroupWishingPool', {id: id, items: tags})}
            >
            <Image 
              style = {{height: "25%", width: "25%"}}
              source = {require('../../assets/manyneed/heart.png')}/>
          </TouchableOpacity>

        </View>

          <View style = {{flex:1.4, alignItems: 'center',width:"100%", backgroundColor:colors.mono_40}}>
              <ScrollView contentContainerStyle = {{ width: "90%", backgroundColor: colors.mono_40, alignItems:'center'}}>
                    <Text style = {{color: colors.mono_80}}>{discription}</Text>
              </ScrollView>
          </View>

          <View style = {{flex: 0.1, backgroundColor:colors.mono_40, width:'100%'}}></View>

          <View style = {{flex: 8, backgroundColor: colors.mono_40}}>
            <View style ={{backgroundColor: colors.mono_40}}>
            <View style = {{height: ScreenWidth*0.06, flexDirection:'row', backgroundColor: colors.mono_40, alignItems:'center'}}>
                <View style = {{width: "5%"}}></View>
                <ScrollView style = {{width: '95%', backgroundColor: 'transparent'}}>
                  <FlatList
                    data={tags}
                    contentContainerStyle={{backgroundColor: 'transparent', alignItems:'center', justifyContent: 'center'}}
                    horizontal={ true }
                    renderItem={renderItem}
                    keyExtractor={item => item.ID}
                  />
                </ScrollView>
                
            </View>
              <View style = {styles.line}></View>
            </View>
            

            <ScrollView contentContainerStyle = {{backgroundColor: 'transparent', alignItems:'center', justifyContent:'center'}}>

              {data? (<>
              <FlatList
                data={data.filterMatchingGroupItems.matchedItems}
                renderItem={renderPost}
                keyExtractor={item => item.ID}
              />
              <FlatList
                data={data.filterMatchingGroupItems.unmatchedItems}
                renderItem={renderPostN}
                //keyExtractor={item => item.id}
              /></>) : <Text>loading ...</Text>}
              <View style = {{height: 78,backgroundColor: colors.mono_40,}}></View>
            </ScrollView>
            

         </View>

         <TouchableOpacity
              title = 'add'
              onPress={() => {navigation.navigate('GroupAddItem',{tags: tags, id: id})}}
              style={styles.button}>
              <Image
                style = {styles.button}
                source = {require("../../assets/general/add.png")}/>
          </TouchableOpacity>
      </View>
    ) 

}

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  line: {
    marginTop: 5,
    height: 1,
    backgroundColor: colors.function_100,
    width: "90%",
    alignSelf:"center",
  },
  
  container: {
    flex:1
  },
  tag:{
    //flex:1,
    flexDirection:'row',
    marginRight: ScreenWidth*0.05,
    backgroundColor: colors.function_100,
    //width: ScreenWidth*0.18,
    paddingHorizontal: ScreenWidth*0.05,
    height: ScreenWidth*0.06,
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: ScreenWidth*0.015,
  },
  item: {
    flexDirection:'row',
    backgroundColor: colors.function_100,
    height: ScreenWidth*0.2,
    width: ScreenWidth*0.9,
    //padding: 20,
    justifyContent:'flex-start',
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth:1,
    borderColor: colors.mono_60,

    // shadowColor: colors.mono_100,
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.5,
    // shadowRadius: 0,
    // elevation: 3,
  },
  itemN: {
    flexDirection:'row',
    backgroundColor: colors.mono_40,
    height: ScreenWidth*0.2,
    width: ScreenWidth*0.9,
    //padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth:1,
    borderColor: colors.mono_60,
    // shadowColor: colors.mono_100,
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.5,
    // shadowRadius: 0,
    // elevation: 3,
  },
  button: {
    width: 65,
      height: 65,
      position: 'absolute',
      borderRadius: 31.5,
      backgroundColor: 'transparent',
      bottom: ScreenHeight*0.07,
      //right: 169,
      alignSelf: 'center',
      justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    top:2,
    fontWeight:'bold',
    
  },
  tagT: {
    fontSize: 15,
    fontWeight: '300',
    
  },
  buttonText: {
    fontSize: ScreenWidth*0.03,
    color:colors.mono_40,
    fontWeight: '900',
  },

});