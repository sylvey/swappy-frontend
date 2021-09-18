import { styleSheets } from 'min-document';
import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity, 
    TextInput,
    ScrollView,
    useWindowDimensions,
    SafeAreaView,
    FlatList,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    } from 'react-native';
import { Picker } from 'react-native-woodpicker';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../config/colors';
// import { Picker } from '@react-native-picker/picker';
import { useMutation,  gql } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ADD_GROUP_ITEM = gql`
  mutation createGroupItem($title:String!, $groupId:ID!, $tag: String, $description: String!, $exchangeMethod: ExchangeMethod!, $image: String){
    createGroupItem(groupId:$groupId, input: {
      title: $title
      tag: $tag
      description: $description
      exchangeMethod: $exchangeMethod
      image: $image
    })
  }`;

  const UPLOAD_FILE = gql`
  mutation uploadFile ($file: Upload!) {
    uploadFile(file: $file){
      url
    }
  }
  `;

let ScreenWidth = Dimensions.get("window").width;

function GroupAddItem ({route, navigation}) {

  // const [Gname, setGname] = useState('');
  const [title, setTitle] = useState('');
  const [Discription, setDiscription] = useState('');
  //const [Ihave, setIhave] = useState([]);
  const [pickedData, setPickedData] = useState();
  const [tag, setTag] = useState('');
  
  const [dummyData, setDummyData] = useState([{way: '面交', isSelected: false},
                                               {way: '寄送', isSelected: false}]);
  const [exchangeMethod, setExchangeMethod] = useState('NOTSELECTED')
  const [image, setImage] = useState([]);

  const [createGroupItem, { data, error, loading }] = useMutation(ADD_GROUP_ITEM);
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: data => console.log(data)
  });
  const windowHeight = useWindowDimensions().height;

  const {tags, id} = route.params;

  const dropdownData = [];
  for(var i = 0; i< tags.length; i++){
    dropdownData[i] = {label: tags[i], value:tags[i]};
  }

  
  const generateRNImage = (uri, name) => {
    return uri ? new ReactNativeFile({
      uri,
      type:'image/png',
      name: `image_${name}.png`,
    }) : null;
  }



  const pickImage = async () => {
    if(image.length < 5)
    {
      console.log(tags);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        
        setImage([...image, {id: image.length, uri: result.uri}]);
      }
    }
    else
    {
      alert("最多只能5張照片喔qq")
    }
    console.log(dropdownData)
  };

  const renderImage = ({ item }) => (
    <SafeAreaView style = {styles.imageContainer}>
      <Image 
        style={styles.image}
        source={{uri: item.uri}}/>
    </SafeAreaView> 
  );

  useEffect(() => {
    //setData(BreakAwaySpace);
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  },[]);

  

  const selectionHandlerSort = (ind) => {
    
    // let arr2 = Ihave.map((item, index)=>{
    //   if(ind == index){
    //     item.isSelected = !item.isSelected;
    //   }
    //   return {...item}
    // })
    // console.log("selection handler ==>", arr2)
    setTag(tags[ind]);
    console.log(tag);
  }



  const selectionHandler = (ind) => {
    //alert("jie")
    //const {Gname, Discription, Ihave, Iwant, dummyData} = this.state;
    let arr1 = dummyData.map((item, index)=>{
      if(ind == index){
        item.isSelected = !item.isSelected;
      }
      return {...item}
    })
    //console.log("selection handler1 ==>", arr1)
    setDummyData(arr1)

    if(dummyData[0].isSelected == true && dummyData[1].isSelected == true) {
      setExchangeMethod("BOTH");
    } else if (dummyData[0].isSelected == true && dummyData[1].isSelected == false) {
      setExchangeMethod("FACETOFACE");
    } else if (dummyData[0].isSelected == false && dummyData[1].isSelected == true) {
      setExchangeMethod("BYPOST");
    } else {
      setExchangeMethod("NOTSELECTED");
    }
    //console.log(exchangeMethod);
  }

  const handlesubmit =() =>{
    console.log(id, typeof(tag), typeof(Discription), typeof(exchangeMethod));
    if(image.length == 0) {
      createGroupItem({ variables: { title: title, groupId: id, tag: tag, description: Discription, exchangeMethod: exchangeMethod, image: ''}});
      
    } else {
      for (let i = 0; i < image.length; i++) {
        //console.log(typeof(image[i].uri));
        const file = generateRNImage(image[i].uri, Math.random().toString(36).slice(-10));
        //console.log(file.name);
        uploadFile({variables: { file: file }, uploadFileAsForm: true});
        //console.log(data);
        createGroupItem({ variables: { title: title, groupId: id, tag: tag, description: Discription, exchangeMethod: exchangeMethod, image: file.name}});
      }
    }

    navigation.goBack()
  } 

  const onValueChange = (pickedData) => {
    setPickedData(pickedData)
    setTag(pickedData.value);
    //setTag(value);
    console.log(tag);
  }

  
    return(
      <View style={{flex:1, flexDirection: 'column',  }}>
        <KeyboardAvoidingView style={{height: windowHeight *0.15 ,flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <ScrollView 
              style = {{height: "100%" }}
              contentContainerStyle ={{alignItems:'center'}}
              horizontal = {true}
              >
              {
                  image == []? null:(<FlatList
                    data={image}
                    renderItem={renderImage}
                    horizontal = {true}
                  />)
              }
              
              {/* <View style = {styles.buttonAdd}> */}
                  <TouchableOpacity 
                      style={styles.buttonAddContainer}
                      onPress={pickImage}
                      >
                      <Image
                        style = {{height:ScreenWidth*0.05, width: ScreenWidth*0.05}}
                        source={require("../../assets/breakAway/add.png")}/>
                  </TouchableOpacity>
              {/* </View> */}
          </ScrollView>
           
        </KeyboardAvoidingView>
       {/* duplicate from breakAwayHesitate */} 

      <KeyboardAvoidingView style = {styles.line}></KeyboardAvoidingView>


      <KeyboardAwareScrollView>
      {/* <ScrollView > */}
          <View style ={styles.textContainer}>
              <Text style={styles.text}>交付方式 </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style = {{flex: 0.5}}></View>
            <View style = {{flex: 9.5, flexDirection: 'row'}}>
            {
              dummyData.map((item, index)=>{
                return(
                  <TouchableOpacity
                    onPress={()=>selectionHandler(index)}
                    title = 'method'
                    style = {item.isSelected ? styles.wayS : styles.waySd}>
                    {/* //onPress={this.handleupload}
                    // style = {{flexDirection:'row', */}
                    {/* // marginHorizontal: ScreenWidth*0.05, */}
                    {/* // marginVertical:ScreenWidth*0.03,
                    // backgroundColor: item.isSelected? colors.function_100: colors.mono_60,
                    // width: ScreenWidth*0.3,
                    // height: ScreenWidth*0.1,
                    // alignItems:'center',
                    // justifyContent: 'center',
                    // borderRadius: ScreenWidth*0.02,}}> */}
                    <Text style = {styles.buttonText}>{item.way}</Text> 
                  </TouchableOpacity>
                );
              })
            }
            </View>
          </View>

          <View style ={styles.textContainer}>
            <Text style={styles.text}>物品標題</Text>
          </View>

          <View style = {styles.textInputContainer}>
            <TextInput
                style={styles.titleInputBox}
                //multiline ={true}
                onChangeText={(text) => {setTitle(text)}}
                value = {title}/>
          </View>

          <View style ={styles.textContainer}>
            <Text style={styles.text}>物品說明</Text>
          </View>

          <View style = {styles.textInputContainer}>
            <TextInput
                style={styles.input}
                multiline ={true}
                onChangeText={(text) => setDiscription(text)}
                value = {Discription}/>
          </View>

          <View style ={styles.textContainer}>
            <Text style={styles.text}>物品種類</Text>
          </View>


            {/* <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
              {
                tags.map((item, index)=>{
                  return(
                    <TouchableOpacity
                      onPress={()=>selectionHandlerSort(index)}
                      title = 'sort'
                      //onPress={this.handleupload}
                      style = {{
                        flexDirection:'row',
                        marginHorizontal: ScreenWidth*0.05,
                        marginVertical:ScreenWidth*0.03,
                        backgroundColor: item.isSelected? colors.function_100: colors.mono_60,
                        width: ScreenWidth*0.3,
                        height: ScreenWidth*0.1,
                        alignItems:'center',
                        justifyContent: 'center',
                        borderRadius: ScreenWidth*0.02,
                        }}>
                      <Text style = {styles.buttonText}>{item}</Text> 
                    </TouchableOpacity>
                  );
                })
              }
            </ScrollView> */}

            <View style ={styles.textInputContainer}>
              <View style = {{flex: 0.5}}></View>
                <View style = {{flex: 3.5, justifyContent: 'center'}}>
                    {/* <Picker
                      mode={'dropdown'}
                      //style={styles.input3}
                      style={{height: 25,width:200}}
                      selectedValue={tag}
                      // onValueChange={(value)=>onValueChange(2 ,value)}
                      //onValueChange= {(itemValue, itemIndex) => setTag(tags[itemValue])}>
                      onValueChange = {(value) => onValueChange(2, value)}>
                      {
                        tags.map((item, index)=>{
                          return(
                            <Picker.Item label= {item} value= {item} />
                          );
                        })
                      }
                    </Picker> */}
                    <Picker
                      //textInputStyle = {}
                      //containerStyle = {}
                      item={pickedData}
                      items={dropdownData}
                      onItemChange={onValueChange}
                      title="群組物品種類"
                      placeholder="選擇物品種類"
                      isNullable
                      />
                </View>
                <View style = {{flex: 6}}></View>
            </View>


                
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

      {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </View>
  )
  // }

}

export default GroupAddItem;

const styles = StyleSheet.create({
  textInputContainer:{
    flex:1,
    justifyContent:'center',
    flexDirection:'row',
    height:"100%",
    width: "100%",
    backgroundColor:"transparent",      
  },
  itemS: {
    backgroundColor: '#7a42f4',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  wayS: {
    backgroundColor: colors.mono_60,
    width: "20%",
    height: 25,
    margin: 5,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center', 
  },
  waySd: {
    backgroundColor: colors.function_100,
    width: "20%",
    height: 25,
    margin: 5,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center',
  },
  buttonText: {
    fontSize: ScreenWidth*0.03,
    color:colors.mono_40,
    fontWeight: '900',
  },
  item: {
    height:70,
    width:70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    width: ScreenWidth*0.2, 
    height: ScreenWidth*0.2,  
  },
  imageContainer:{
    flex:1, 
    left: 10, 
    margin : 10, 
    justifyContent:'center', 
    alignItems:'center', 
    flexDirection: 'row',
  },
  flatListContainer:{
    flex:4, 
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems:'center',      
  },
  wayS: {
    backgroundColor: colors.function_100,
    width: "20%",
    height: 25,
    margin: 5,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center', 
  },
  waySd: {
    backgroundColor: colors.mono_60,
    width: "20%",
    height: 25,
    margin: 5,
    borderRadius:2,
    justifyContent:'center',
    alignItems:'center',
  },
  
  buttonAddContainer: {
    margin: 20,
    borderColor: colors.mono_80,
    borderWidth: 1,
    width: ScreenWidth*0.2,
    height: ScreenWidth*0.2,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: colors.function_100,
    width: "90%",
    alignSelf:"center",
  },
  textContainer:{
    flex:1,
    justifyContent:'center',
    backgroundColor:'transparent',      
  },
  textInputContainer:{
    flex:1,
    alignItems:'center',
    //justifyContent:'center',
    flexDirection:'row',
    height:"100%",
    width: "100%",
    backgroundColor: "transparent",      
  },
  uploadContainer:{
    flex:1,
    justifyContent:'center',
    height:"100%",
    backgroundColor:"transparent",  
    alignItems:'center',
    justifyContent:'center',    
  },
  text:{
    margin: "5%",
    color: colors.mono_80,
    fontWeight: "bold",
  },
  titleInputBox: {
    flex: 1,
    marginHorizontal:"5%",
    height: 40,
    borderColor: colors.mono_80,
    borderWidth: 1
  },
  input:{
    margin: "5%",
    height: 150,
    borderColor: colors.mono_80,
    borderWidth: 1,
    textAlignVertical: 'top',
    width: "90%"
  },
});