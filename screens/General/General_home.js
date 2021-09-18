//import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { 
  ScrollView,
  View, 
  Text, 
  SafeAreaView,  
  FlatList, 
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Alert,
  Image,
  TouchableOpacity} from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import  { useNavigation } from '@react-navigation/core';

import { useQuery, gql } from '@apollo/client';

// import GeneralItems from '../../Data/GeneralItems';
// import * as SQLite from 'expo-sqlite'
// const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;

import colors from '../../config/colors';

const GENERAL_ITEMS = gql`
query generalItemsList {
  generalItemsList {
    id
    title
    owner {
      id
      username
    }
    description
    exchangeMethod
    category
    image
	}
}`;


const contains = (data, query) => {
  let formatData = data.toLowerCase();
  let formatQuery = query.toLowerCase();

  if (formatData.includes(formatQuery)) {
    return true;
  }
  return false;
}





const General_HOME = () => {

  console.log("render");

  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const { data, error, loading } = useQuery(GENERAL_ITEMS, {pollInterval: 500});

  const windowHeight = useWindowDimensions().height;


  useEffect(() => {
      if (data) {
        console.log(data);
        setItems(data.generalItemsList);
        setAllItems(data.generalItemsList);
        console.log(items);
      } 
  }, [data]);


  const navigation = useNavigation();

  const toNotification = () => {
    navigation.navigate("Notification")
  }

  const toMessage = () => {
    navigation.navigate("MessageHome")
  }

  

  const toAdd = () =>{
    navigation.navigate("GeneralAdd")
  }

  const handleSearch = (se) => {
    console.log("search", search)
    const searchedItems = _.filter(data.generalItemsList, general => {
      return contains(general.title, se)
    })
    setSearch(se);
    setItems(searchedItems);
    // this.setState({ data,  search});
  };

  const renderItem = ({ item }) => (
    //console.log(this.props.navigation);
    <SafeAreaView style={styles.boxContainer}>
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate('GeneralDetail', {userId: item.owner.id, itemID: item.id, title: item.title, sort: item.category, des: item.description, method: item.exchangeMethod, image: item.image})}>
            <Image
              source =  {item.image? {uri: `http://swappy.ngrok.io/images/${item.image}`} : require('../../assets/general/商品呈現.png')}
              style ={{height: ScreenHeight*0.13, width: ScreenHeight*0.13,}}/>
            
            <View style = {{marginLeft: 16}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style = {{marginTop: "5%", color: colors.function_100}}>#{item.category}</Text>
            </View>   
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  


  return(
    
    <SafeAreaView 
      style={{
        minHeight: Math.round(windowHeight),
        flex: 1,
        height: "60%",
        alignItems: "center",
        //justifyContent: 'center',
        backgroundColor: colors.mono_40,
        bottom: 68,
        }}>
      
      <View style = {styles.margin}></View>
    
      <View style = {{top: "15%", height: "10%", width: "90%", flexDirection:'row'}}>
          <View style = {{flex : 5, alignItems: 'center', justifyContent: 'center'}}>
              <SearchBar
                containerStyle = {{ height: "80%", alignItems: 'center', backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                inputContainerStyle = {{height: 28, width: 264, borderRadius: 7, backgroundColor: colors.mono_60}}
                inputStyle= {{margin: 0,fontSize: 15}}
                placeholder="標題、種類、物品資訊"
                onChangeText={handleSearch}
                value={search}
              />
          </View>
          
          {/* <TouchableOpacity 
             style={{flex: 1, width: 60, height: 60, alignItems:'center', justifyContent:'center', backgroundColor: 'transparent'}}
             onPress={toMessage}>
            <Image
              style = {{width: 24, height: 21.99}}
              source = {require("../../assets/general&group/message.png")}/>
            
          </TouchableOpacity> */}

         <TouchableOpacity 
             style={{flex: 1, left: 0,alignItems:'center', justifyContent:'center',  width: 60, height: 60, backgroundColor: 'transparent'}}
             onPress={toNotification}>
            <Image
              style = {{height: "40%"}}
              source = {require("../../assets/general&group/notification.png")}/>
          </TouchableOpacity>   
      </View>
      
      <ScrollView style = {{top: "5%", alignContent: 'center'}}>
        <View>
          {data ? ( <FlatList
              inverted = {true}
              data={search == ''? data.generalItemsList: items}
              renderItem={renderItem}
            /> ) : <Text>loading...</Text>}
        </View>
        
        
        <View style = {{height: 78,backgroundColor: colors.mono_40,}}></View>
      </ScrollView>
     
      <TouchableOpacity 
          style={styles.button}
          onPress={toAdd}>
          <Image
            style = {styles.button}
            source = {require("../../assets/general/add.png")}/>
      </TouchableOpacity>
      
    </SafeAreaView>
  )
  

}

export default General_HOME;

const styles = StyleSheet.create({
    margin: {
      position: 'relative',
      height: "10%",
      backgroundColor: colors.mono_40,
    },
    boxContainer: {
      marginBottom: ScreenHeight*0.03,
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
      bottom: ScreenHeight*0.07,
      //right: 169,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });