import React, { useState, useEffect } from 'react';

import { 
  View, 
  Text, 
  SafeAreaView,  
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
 } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import colors from '../../config/colors';
import  { useNavigation } from '@react-navigation/core';
import SocialItems from '../../Data/SocialItems';
import SocialCollection from '../../Data/SocialCollection';

import { useQuery, useMutation,  gql } from '@apollo/client';

const RENDER_MYCOLLECTION = gql`
query getMyCollections{
  getMyCollections{
    id
    title
    description
    author{
      username
    }
  }
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



const inMyList = (data, collection) => {
    let query = collection
    let data1 = data
    for(let i = 0; i < query.length; i++){
      if(data1 == query[i]){
        return true;
      }
    }
    return false;  
}



const MyCollection_HOME = () => {

  const [search, setSearch] = useState('');
  const [data1, setData1] = useState([]);
  const [fullData, setFullData] = useState([]);

  const { data, error, loading } = useQuery(RENDER_MYCOLLECTION, {pollInterval: 500});

  console.log(error);
  const navigation = useNavigation();

  const windowHeight = useWindowDimensions().height;

  const handleSearch = (se) => {
    console.log("search", search)
    const searchedItems = _.filter(data.getMyCollections, post => {
      return contains(post.author?.username, post.title, post.description, search)
    })
    setSearch(se);
    setData1(searchedItems);
    
  };

  const handleCollected = (id) =>{
    //const {data} = this.state;
    let arr = data1.map((item, index)=>{
      if(id == index){
        item.collected = !item.collected;
      }
      return {...item}
    })
    console.log("selection handler1 ==>", arr);
    setData1(arr);
    //this.setState({data: arr})
  };

  const renderChat = ({ item }) => (
    //console.log(this.props.navigation);
    <View style={styles.ChatC}>
        <TouchableOpacity 
            style = {styles.Chat} 
            onPress={()=>navigation.navigate('MainDetail', {id: item.id, title: item.title, person: item.author?item.author.username : "匿名", post: item.description, description: item.description, hideName: item.author? null : "匿名"})}
            //onPress={() => navigation.navigate('MainDetail', {title: item.title, person: item.author?item.author.username : "匿名", post: item.description, comment: null, hideName: null})}
            >
          <Text style={styles.post}>{item.title}</Text>
          <Text style={styles.person}>{item.author?item.author.username : "匿名"}</Text>
          <Text 
              style={styles.description} 
              ellipsizeMode={'tail'} 
              numberOfLines={2}>{item.description}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
            style={{width: 10, height: 20, position:'absolute', right: 20, top: 0, backgroundColor: 'transparent'} }
            //onPress={()=>handleCollected(item.id)}
            >
          <Image
            //style ={{width:10, height: 20, tintColor: item.collected? colors.warning_80: colors.brown_40}}
            style ={{width:10, height: 20, tintColor: colors.function_100}}
            source={require('../../assets/Social/collect.png')}/>
        </TouchableOpacity> */}
    </View>
  );

    useEffect(() => {
      const datafilter = _.filter(SocialItems, post => {
          return inMyList(post.id, SocialCollection)
      })
      let arr = datafilter.map((item, index)=>{
        item.collected = true
        return {...item}
      })

      setData1(arr);
      setFullData(datafilter);
      // this.setState({
      //   data: arr,
      //   fullData: datafilter,
      // });
    }, []);
  

  // render() {
  //   const { search } = this.state;
  //   // const[grvalue, grsetValue] = useState('');
  //   const{ navigate } = this.props.navigation;
  //   //console.log(this.props.navigation);

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
        {/* <SearchBar
          placeholder="Type Here..."
          onChangeText={handleSearch}
          value={search}
          lightTheme
        /> */}

      <ScrollView style = {{top: "5%", alignContent: 'center'}}>
        <View>
          {data ? (<FlatList
            inverted = {true}
            data={search == ''? data.getMyCollections: data1}
            renderItem={renderChat}
            keyExtractor={item => item.id}
          />

          ) : <Text>loading...</Text>

          }
        </View>
        <View style = {{height: 78,backgroundColor: colors.mono_40,}}></View>
      </ScrollView>

        {/* <FlatList
          data={data}
          renderItem={renderChat}
          keyExtractor={item => item.id}
        /> */}

      </SafeAreaView>
    )
  

}

export default MyCollection_HOME;

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
});