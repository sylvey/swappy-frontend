import { styleSheets } from 'min-document';
import React from 'react';
import { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity, 
    TextInput,
    Alert,
    Platform,
    useWindowDimensions,
    FlatList,
    SafeAreaView,
    Image,
    ScrollView, 
    KeyboardAvoidingView,
    } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
//import { Picker } from '@react-native-picker/picker';
import { Picker } from 'react-native-woodpicker';
// import * as SQLite from "expo-sqlite";
import colors from '../../config/colors';
import { ReactNativeFile } from 'apollo-upload-client';

import { useMutation,  gql } from '@apollo/client';
import { PickerIOSComponent } from 'react-native';
import { PickerIOSBase } from 'react-native';

let ScreenWidth = Dimensions.get("window").width;



  const CREATE_GENERALITEM = gql`
  mutation createGeneralItem ($title: String!, $description: String!, $category: String!, $exchangeMethod: String!, $image: String) {
    createGeneralItem(input: {
      title: $title
      description: $description
      category: $category
      exchangeMethod: $exchangeMethod
      image: $image
    }) {
      id
      owner {
        username
        id
      }
      description
    }
  }`;

  const UPLOAD_FILE = gql`
  mutation uploadFile ($file: Upload!) {
    uploadFile(file: $file){
      url
    }
  }
  `;

  // <Picker
  //                   mode={'dropdown'}
  //                   style={{height: 25,width:200}}
  //                   selectedValue={dropdown}
  //                   onValueChange={(value)=>onValueChange(2,value)}>
  //                   <Picker.Item label="" value="" />
  //                   <Picker.Item label="書籍" value="書籍" />
  //                   <Picker.Item label="衣服與配件" value="衣服與配件" />
  //                   <Picker.Item label="玩具" value="玩具" />
  //                   <Picker.Item label="特色周邊品" value="特色周邊品" />
  //                   <Picker.Item label="小型生活器具" value="小型生活器具" />
  //                   <Picker.Item label="家電用品" value="家電用品" />
  //                   <Picker.Item label="其他" value="其他" />
  //                 </Picker>
  //           </View>

const General_ADD = () => {
  const [pickedData, setPickedData] = useState();

  const dropdownData = [
    { label: "書籍", value: "書籍" },
    { label: "衣服與配件", value: "衣服與配件" },
    { label: "玩具", value: "玩具" },
    { label: "特色周邊品", value: "特色周邊品" },
    { label: "小型生活器具", value: "小型生活器具" },
    { label: "家電用品", value: "家電用品" },
    { label: "其他", value: "其他" }
  ];

  const [itemName, setitemName] = useState('');
  const [description, setDescription] = useState('');
  const [dropdown, setDropdown] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [dummyData, setdummyData] = useState([ {way: '面交'}, {way: '郵寄'}]);

  const [image, setImage] = useState([]);

  const navigation = useNavigation();
  const windowHeight = useWindowDimensions().height;

  const [createItem] = useMutation(CREATE_GENERALITEM);
  const [uploadFile, { data }] = useMutation(UPLOAD_FILE, {
    onCompleted: data => console.log(data)
  });

  useEffect(() => {
    console.log(dummyData);
    let arr = dummyData.map((item, index)=>{
      item.isSelected = false
      return {...item};
    });
    setdummyData(arr);
    console.log(dummyData);
  }, []);

  const renderImage = ({ item }) => (
    <SafeAreaView style = {styles.imageContainer}>
      <Image 
        style={styles.image}
        source={{uri: item.uri}}/>
    </SafeAreaView> 
  );


  const pickImage = async () => {
    if(image.length < 5)
    {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
  
      console.log(result.uri);
  
      if (!result.cancelled) {
        console.log(result);
        setImage([...image, {id: image.length, uri: result.uri}]);
        console.log(image);
      }
    }
    else
    {
      alert("最多只能5張照片喔qq")
    }
    
  }; 

  useEffect(()=> {
    const _deliveryMethod = deliveryMethodHandler()
    setDeliveryMethod(_deliveryMethod);
    console.log(deliveryMethod);
  }, [dummyData])

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

  

  const selectionHandler = (ind) => {
    console.log(dummyData);
    let arr = dummyData.map((item, index)=>{
      if(ind == index){
        item.isSelected = !item.isSelected;
      }
      return {...item}
    });
    //console.log("selection handler ==>", arr);
    setdummyData(arr);
  };

  const // summarizes the delivery method into 3 categories:
  // 0: Not yet selected, 2: FacetoFace only, 1: byPost only, 3: FacetoFace AND byPost
  deliveryMethodHandler = () => {
    let facetoFace = dummyData[0].isSelected;
    let byPost = dummyData[1].isSelected;
    if(facetoFace == true && byPost == true) {
      return '3';
    } 
    if(facetoFace == true) {
      return '2';
    }
    if(byPost == true) {
      return '1';
    }
    return '0';
  }

  const generateRNImage = (uri, name) => {
    return uri ? new ReactNativeFile({
      uri,
      type:'image/png',
      name: `image_${name}.png`,
    }) : null;
  }

  const handlesubmit =() =>{
    console.log(dropdown);
    if(image.length == 0) {
      createItem({variables: { title: itemName, description: description, category: dropdown, exchangeMethod: deliveryMethod, image: ''}});
    } else {
      for (let i = 0; i < image.length; i++) {
        const file = generateRNImage(image[i].uri, Math.random().toString(36).slice(-10));
        uploadFile({variables: { file: file }, uploadFileAsForm: true});
        createItem({variables: { title: itemName, description: description, category: dropdown, exchangeMethod: deliveryMethod, image: file.name}});
      }
    }
    
    navigation.navigate('General');
  } 

  const selectCategory = (pickedData) => {
    setPickedData(pickedData)
    setDropdown(pickedData.value);
    console.log(dropdown);
  };  


  return(
    <View style={{flex:1, flexDirection: 'column',  }}>
      {/* <Text style={styles.buttonText}>Item Name</Text> */}
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
          <View style ={styles.textContainer}>
              <Text style = {styles.text}>物品標題</Text>
          </View>

          <View style ={styles.textInputContainer}>
              <TextInput
                  style={styles.input}
                  onChangeText={setitemName}
                  value = {itemName}/>
          </View>
          

          <View style ={styles.textContainer}>
            <Text style={styles.text}>物品種類</Text> 
          </View>


        <View style ={styles.textInputContainer}>
          <View style = {{flex: 0.5}}></View>
            <View style = {{flex: 3.5, justifyContent: 'center'}}>
                {/* <Picker
                    mode={'dropdown'}
                    style={{height: 25,width:200}}
                    selectedValue={dropdown}
                    onValueChange={(value)=>onValueChange(2,value)}>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="書籍" value="書籍" />
                    <Picker.Item label="衣服與配件" value="衣服與配件" />
                    <Picker.Item label="玩具" value="玩具" />
                    <Picker.Item label="特色周邊品" value="特色周邊品" />
                    <Picker.Item label="小型生活器具" value="小型生活器具" />
                    <Picker.Item label="家電用品" value="家電用品" />
                    <Picker.Item label="其他" value="其他" />
                  </Picker> */}
                  <Picker
                      //textInputStyle = {}
                      //containerStyle = {}
                      item={pickedData}
                      items={dropdownData}
                      onItemChange={selectCategory}
                      title="物品種類"
                      placeholder="選擇物品種類"
                      isNullable
                    //backdropAnimation={{ opactity: 0 }}
                    //mode="dropdown"
                    //isNullable
                    //disable
                  />
            </View>
          <View style = {{flex: 6}}></View>
        </View>

        <View style ={styles.textContainer}>
            <Text style={styles.text}>交付方式</Text> 
        </View>

        
          <View style={styles.textInputContainer}>
            <View style = {{flex: 0.5}}></View>
            <View style = {{flex: 9.5, flexDirection: 'row'}}>
            {
              dummyData.map((item, index)=>{
                return(
                  <TouchableOpacity
                    onPress={()=>selectionHandler(index)}
                    title = 'upload'
                    style = {item.isSelected ? styles.wayS : styles.waySd}>
                    <Text style = {styles.buttonText}>{item.way}</Text> 
                  </TouchableOpacity>
                );
              })
            }
            </View>
          </View>

          <View style ={styles.textContainer}>
              <Text style={styles.text}>物品說明</Text>
          </View>

          <View style = {{flex:3}}>
              <TextInput
                  style={styles.inputStory}
                  //placeholder='second hand, not brandnew'
                  multiline = {true}
                  onChangeText={setDescription}
                  value = {description}/>
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

        </KeyboardAwareScrollView>
        
    </View>
  )

}

export default General_ADD;


const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginHorizontal:"5%",
    height: 40,
    borderColor: colors.mono_80,
    borderWidth: 1
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
  buttonText: {
    color: colors.mono_40,
    fontSize: 15,
    fontWeight: 'bold',
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
    flexDirection: 'row'
  },
  flatListContainer:{
    flex:4, 
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems:'center',      
  },
  buttonAddContainer: {
    margin:20,
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
    justifyContent: "space-around",
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
  input: {
    flex: 1,
    marginHorizontal:"5%",
    height: 40,
    borderColor: colors.mono_80,
    borderWidth: 1
  },
  input2: {
    flex: 1,
    width: ScreenWidth*0.3,
    height: 40,
    borderColor: colors.mono_80,
    borderWidth: 1
  },
  input3: {
    flex: 1,
    width: ScreenWidth*0.5,
    height: 40,
    borderColor: colors.mono_80,
    borderWidth: 1
  },
  inputStory:{
    margin: "5%",
    height: 150,
    borderColor: colors.mono_80,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
});