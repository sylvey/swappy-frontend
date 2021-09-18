import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,  
  FlatList, 
  StyleSheet,
  Dimensions,
  ScrollView, 
  useWindowDimensions,
  TouchableOpacity,
  Image } from "react-native";
import  { useNavigation } from '@react-navigation/core';
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import colors from '../../config/colors';
import GroupItems from '../../Data/GroupItems';
import { useQuery,  gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;


const contains = (data, tags, query) => {
  let formatData = data.toLowerCase();
  let formatQuery = query.toLowerCase();

  if (formatData.includes(formatQuery)) {
    return true;
  }

  for(var i = 0; i < tags.length; i++){
    let tag = tags[i].toLowerCase();
    if(tag.includes(formatQuery)){
      return true;
    }
  }
  
  return false;
}

const RENDER_GROUP = gql`
  query getGroups {
    getGroups {
      id
      title
      description
      tags
    }
  }`;

const Group_HOME = () => {

  const { data, error, loading } = useQuery(RENDER_GROUP, {pollInterval: 500});
  
  const [search, setSearch] = useState('');
  const [data1, setData1] = useState([]);
  const [fullData, setFullData] = useState([]);
  const navigation = useNavigation();
 
  const windowHeight = useWindowDimensions().height;

  const toNotification = () => {
    navigation.navigate("Notification")
  }

  const toMessage = () => {
    navigation.navigate("MessageHome")
  }

  const handleSearch = (search) => {
    console.log("search", search)
    const data1 = _.filter(data.getGroups, group => {
      return contains(group.title, group.tags, search)
    })
    setSearch(search);
    setData1(data1);
    //this.setState({ data,  search});
  };

  const renderItem = ({ item }) => (
    //console.log(this.props.navigation);
    <SafeAreaView style={styles.boxContainer}>
      <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('GroupDetail', {title: item.title, discription: item.description, tags: item.tags, items: item.items, post: item.post, id: item.id})}>
            <Text style = {styles.title}>{item.title}</Text>
            <Text style = {{marginTop: "5%", color: colors.function_100}}>{item.tags[0]? "#": null}{item.tags[0]} {item.tags[1]? "#": null}{item.tags[1]} {item.tags[2]? "#": null}{item.tags[2]}</Text>           
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  useEffect(()=> {
    //setData(GroupItems);
    setFullData(GroupItems);
  });
  


  return(
    <SafeAreaView style={{
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
          { data ? 
            (<FlatList
              inverted = {true}
              data={search == ''? data.getGroups : data1}
              renderItem={renderItem}
              keyExtractor={item => item.id}

            />) : <Text>loading ...</Text>
          }
        </View>
        <View style = {{height: 78,backgroundColor: colors.mono_40,}}></View>
        
      </ScrollView>

      <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('GroupAdd')}>
         <Image
            style = {styles.button}
            source = {require("../../assets/general/add.png")}/>
      </TouchableOpacity>
    </SafeAreaView>
  )
  

}

export default Group_HOME;

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
    backgroundColor: 'transparent',
    //padding: 20,
    height: "100%",
    //marginVertical: 8,
    marginHorizontal: 16,
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