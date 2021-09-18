import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView, 
  Text, 
  SafeAreaView,  
  FlatList, 
  StyleSheet, 
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Dimensions
 } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import  { useNavigation } from '@react-navigation/core';
import SocialItems from '../../Data/SocialItems';
import { TextInput } from 'react-native';
import colors from '../../config/colors';

import { useQuery, useMutation,  gql } from '@apollo/client';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;

const RENDER_POST = gql`
  query getPosts {
    getPosts {
    title
    description
    id
    author{
      username
    }
    time
  }
}`;

const ADD_TO_COLLECTION = gql`
mutation addToCollection($postId: ID!){
  addToCollection(postId: $postId)
}`;

const REMOVE_FROM_COLLECTION = gql`
mutation removeFromCollection($postId: ID!){
  removeFromCollection(postId: $postId)
}`;


const contains = (data1, data2, data3, query) => {
  let formatData1 = data1? data1.toLowerCase(): null;
  let formatData2 = data2.toLowerCase();
  let formatData3 = data3.toLowerCase();

  let formatQuery = query.toLowerCase();

  if(formatData1) {
    if (formatData1.includes(formatQuery) || formatData2.includes(formatQuery) || formatData3.includes(formatQuery)) {
      return true;
    }
  }
  else{
    if (formatData2.includes(formatQuery) || formatData3.includes(formatQuery)) {
      return true;
    }
  }
  return false;
}



const Main_HOME = () => {

  
  const [search, setSearch] = useState('');
  const [data1, setData1] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selected, setSelected] = useState(new Map());
  const navigation = useNavigation();
 
  const windowHeight = useWindowDimensions().height;

  const { data, error, loading } = useQuery(RENDER_POST, {pollInterval: 500});

  console.log(data);
  const handleSearch = (se) => {
    console.log("search", search)
    const searchedItems = _.filter(data.getPosts, post => {
      return contains(post.author?.username, post.title, post.description, se)
    })
    setSearch(se);
    setData1(searchedItems);
    console.log(data1);
    //this.setState({data,  se});
  };



  // const renderChat = ({ item }) => {
  //   let collected = false;
  //   return (
  //   <View style={styles.ChatC}>
  //       <TouchableOpacity style = {styles.Chat} onPress={() => navigation.navigate('MainDetail', {title: item.title, person: item.author, post: item.description, comment: item.comments, hideName: item.hideUser})}>
  //         <Text style={styles.post}>{item.title}</Text>
  //         <Text style={styles.person}>{item.author == null? "匿名" : item.author.username}</Text>
  //         <Text style={styles.person}>{item.description}</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity 
  //           style={{width: 10, height: 20, position: 'absolute', top: 0, right: 20, backgroundColor: 'transparent'} }
  //           onPress={()=>{collected = !collected; handleCollected(collected, item.id)}}>
  //         <Image
  //           style ={{width:10, height: 20, tintColor: collected? colors.warning_80: colors.brown_40}}
  //           source={require('../../assets/Social/collect.png')}/>
  //       </TouchableOpacity>
  //   </View>
      
          
  // )};
 
  

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
            inputStyle= {{margin: 0, fontSize: 15}}
            placeholder="標題、內容、發文者"
            onChangeText={handleSearch}
            value={search}
          />
        </View>
      </View>

      <ScrollView style = {{top: "5%", alignContent: 'center'}}>
        <View>
          {data ? (
          <FlatList
            data={search == ''? data.getPosts: data1}
            inverted ={true}
            renderItem={({item}) => { 
              return <FlatListComponent 
                id={item.id}
                person = {item.author?item.author.username : "匿名"}
                title = {item.title}
                description = {item.description}
                hideName = {item.hideUser}
                comments = {item.comments}
                time = {item.time}
                navigation = {navigation} />}}
            //renderItem={renderChat}
            keyExtractor={item => item.id}
          />

          ) : <Text>loading...</Text>

          }
        </View>
        <View style = {{height: 78,backgroundColor: colors.mono_40,}}></View>
      </ScrollView>


      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('MainAdd')}>
        <Image
            style = {styles.button}
            source = {require("../../assets/Social/add.png")}/>
      </TouchableOpacity>
      
      
    </SafeAreaView>
        

      
    )
  

}

export default Main_HOME;

function FlatListComponent(props)  {
  // state = {
  //   collected: false,
    
  // }
  // const [collected, setCollected] = useState(false)
  const [addToCollection] = useMutation(ADD_TO_COLLECTION);
  const [removeFromCollection] = useMutation(REMOVE_FROM_COLLECTION);


  // useEffect(() => {
  //   setCollected(false);
  // }, []);

  const handleCollected = (collected, id) =>{
    console.log(collected);
    console.log(id);
    if(collected) {
      addToCollection({ variables: { postId: id } });
    } else {
      removeFromCollection({ variables: { postId: id } });
    }
    
  };

  // render() {
    //const {navigation} = this.props
    //const navigation = useNavigation();
    return (
      <View style={styles.ChatC}>
           <TouchableOpacity
             style={styles.Chat}
             onPress={() => props.navigation.navigate('MainDetail', {id: props.id, title: props.title, person: props.person, post: props.description, description: props.description, hideName: props.hideName, time: props.time})}
            >
                  <Text style={styles.post}>{props.title}</Text>
                  <Text style={styles.person}>{props.person}</Text>
                  <Text 
                    style={styles.description}
                    ellipsizeMode={'tail'} 
                    numberOfLines={2}>{props.description}</Text>
            </TouchableOpacity>
            
     </View>
    )
  
}







const styles = StyleSheet.create({
    margin: {
      position: 'relative',
      height: "10%",
      backgroundColor: colors.mono_40,
    },
    Chat: { 
        backgroundColor: 'transparent',
        marginVertical: 8,
        marginHorizontal: 16,
      },
    ChatC: {
      marginBottom: 30,
      height: 99,
      width: 352,
      backgroundColor: colors.mono_40,
      //left: 30,
      //alignItems: 'center',
      //justifyContent: 'center',
      bottom: 10,
      borderColor: colors.mono_60,
      borderWidth:1,
      // shadowColor: colors.mono_100,
      // shadowOffset: { width: 10, height: 10 },
      // shadowOpacity: 0.5,
      // shadowRadius: 0,
      // elevation: 3,
      },
    person: {
        fontSize: 12,
        color: colors.mono_100
      },
    description: {
      fontSize: 12,
      marginTop: 7,
      color: colors.mono_80
    },
    post: {
        fontSize: 16,
        color: colors.mono_100
    },
    title: {
      fontSize: 32,
      color: colors.mono_100
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