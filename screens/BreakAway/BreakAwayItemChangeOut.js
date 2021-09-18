import { styleSheets } from 'min-document';
import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity, 
    TextInput,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Dimensions,
    } from 'react-native';
import { Picker } from 'react-native-woodpicker';
//import { Picker } from '@react-native-picker/picker';
import colors from '../../config/colors';
let ScreenWidth = Dimensions.get("window").width;
import { ReactNativeFile } from 'apollo-upload-client';


import * as SQLite from 'expo-sqlite'
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object

import { useMutation,  gql } from '@apollo/client';
import { deleteHesitateItem } from '../../localStorageApi/api';
import { createMyStoriesTable, createStoryItem, updateProgress } from '../../localStorageApi/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const CREATE_GENERALITEM_ = gql`
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

const BreakAwayItemChangeOut = ({ route, navigation }) => {
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

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [dropdown, setDropdown] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [dummyData, setdummyData] = useState([ {way: '面交'}, {way: '郵寄'}]);
  const [data1, setData1] = useState([]);

  const [createItem, { data, error, loading }] = useMutation(CREATE_GENERALITEM_);
  const [uploadFile] = useMutation(UPLOAD_FILE);

  const { source, title, itemId, spaceId, story } = route.params;  

  useEffect(() => {
    //console.log(dummyData);
    let arr = dummyData.map((item, index)=>{
      item.isSelected = false
      return {...item};
    });
    setdummyData(arr);
    //console.log(dummyData);
  }, []);

  useEffect(() => {
    createMyStoriesTable();
  }, [])

  useEffect(()=> {
    const _deliveryMethod = deliveryMethodHandler()
    setDeliveryMethod(_deliveryMethod);
    //console.log(deliveryMethod);
  }, [dummyData])

  const selectCategory = (pickedData) => {
    setPickedData(pickedData)
    setDropdown(pickedData.value);
    console.log(dropdown);
  };  

  const deliveryMethodHandler = () => {
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

  const selectionHandler = (ind) => {
    //console.log(dummyData);
    let arr = dummyData.map((item, index)=>{
      if(ind == index){
        item.isSelected = !item.isSelected;
      }
      return {...item}
    });
    //console.log("selection handler ==>", arr);
    setdummyData(arr);
  };

  const generateRNImage = (uri, name) => {
    return uri ? new ReactNativeFile({
      uri,
      type:'image/png',
      name: `image_${name}.png`,
    }) : null;
  }

  const addToStory = (title, source, story, spaceId) =>{
    createStoryItem(title, story, source, spaceId);

    const keepPoints = 2.0
    updateProgress(spaceId, keepPoints);
  }

  const handlesubmit =(itemId) =>{
    console.log('itemName',typeof itemName);
    console.log('description',typeof description);
    console.log('dropdown',typeof dropdown);
    console.log('deliveryMethod',typeof deliveryMethod);
    console.log('source',source);
    //add to general Items
    const file = generateRNImage(source, Math.random().toString(36).slice(-10));
    uploadFile({variables: { file: file }, uploadFileAsForm: true});

    createItem({variables: { title: itemName, description: description, category: dropdown, exchangeMethod: deliveryMethod, image: file.name}});
    //console.log(data, error, loading);
    //add to stroy collection
    addToStory(title, source, story, spaceId);
    deleteHesitateItem(itemId);
    //Navigate back to home page
    navigation.navigate('Home');
  } 

  const onValueChange = (flag,value) => {
    setDropdown(value);
  };  

  return(
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent'}}>
      
      <View style = {{height: "25%", width: "100%", alignItems: 'center'}}>
      {/* <KeyboardAvoidingView style = {{height: "50%", width: "100%", alignItems: 'center'}}> */}
          <Image 
              style = {{flex: 5, height: ScreenWidth * 0.5, width: ScreenWidth * 0.5}}
              source={{uri: source}}/>
      </View>
      {/* </KeyboardAvoidingView> */}
      <KeyboardAwareScrollView style={{width: "100%"}}>
      <ScrollView style = {{width: "100%", backgroundColor: 'transparent'}}>
          <View style ={styles.textContainer}>
            <Text style = {styles.text}>物品標題</Text>
          </View>
      
          <View style ={styles.textInputContainer}>
            <TextInput
                style={styles.input}
                //placeholder='ItemName'
                onChangeText={setItemName}
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
                      //style={{height: 25,width:200}}
                      selectedValue={dropdown}
                      onValueChange={(value)=>onValueChange(2,value)}>
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
      

        <View style={styles.textInputContainer}>
          <View style = {{flex: 0.5}}></View>
          <View style = {{flex: 9.5, flexDirection: 'row'}}>
          {
            dummyData.map((item, index)=>{
              return(
                <TouchableOpacity
                  onPress={()=>selectionHandler(index)}
                  title = 'upload'
                  //onPress={this.handleupload}
                  style = {item.isSelected ? styles.item : styles.itemS}>
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
                style={styles.input}
                placeholder=''
                onChangeText={(text) => {setDescription(text); }}
                value = {description}/>
        </View>

        <View style = {styles.uploadContainer}>
              <TouchableOpacity
                  title = 'Submit'
                  onPress={()=>handlesubmit(itemId)}
                  style = {styles.item}>
                  <Image
                    style = {{height: 70, width:70,}} 
                    source = {require('../../assets/breakAway/upload.png')}/>
              </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAwareScrollView>
      {/* <Button
          title = 'Go to home screen'
          onPress={() => navigate('Home')}/> */}
    </View>
  )
}

export default BreakAwayItemChangeOut;

// export default class BreakAwayItemChangeOut extends React.Component {

//   static navigationOptions = {
//     title: 'General_ADD',
//   }
//   constructor(props) {
//     super(props);
//     this.state = { 
//       ItemName: '', 
//       Description: '',
//       dropdown:' ',
//       deliveryMethod: 0, // 0: Not yet selected, 1: FacetoFace only, 2: byPost only, 3: FacetoFace AND byPost
//       dummyData: [ 
//         {way: 'faceToFace'},
//         {way: 'byPost'},
//       ] 
//   };
    
  

//     database.transaction(tx => {
//       // tx.executeSql(
//       //   "DROP TABLE GeneralItems"
//       // );
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS GeneralItems (
//           id INTEGER PRIMARY KEY AUTOINCREMENT, 
//           title TEXT, 
//           category TEXT, 
//           description TEXT, 
//           method INT, 
//           image TEXT DEFAULT "No image")`
//       )
//     })
//   }

  

//   componentDidMount(){
//     let arr = this.state.dummyData.map((item, index)=>{
//       item.isSelected = false
//       return {...item};
//     })
//     this.setState({dummyData: arr});
//     console.log('arr data ==>', arr)
//   }

//   selectionHandler = (ind) => {
//     //alert("jie")
//     const {ItemName, Description, dummyData} = this.state;
//     let arr = dummyData.map((item, index)=>{
//       if(ind == index){
//         item.isSelected = !item.isSelected;
//       }
//       return {...item}
//     })
//     console.log("selection handler ==>", arr)
//     this.setState({dummyData: arr})
//   }

//   // summarizes the delivery method into 3 categories:
//   // 0: Not yet selected, 1: FacetoFace only, 2: byPost only, 3: FacetoFace AND byPost
//   deliveryMethodHandler = () => {
//     let facetoFace = this.state.dummyData[0].isSelected;
//     let byPost = this.state.dummyData[1].isSelected;
//     if(facetoFace == true && byPost == true) {
//       return 3;
//     } 
//     if(facetoFace == true) {
//       return 2;
//     }
//     if(byPost == true) {
//       return 1;
//     }
//     return 0;
//   }

//   handlesubmit =(itemId) =>{
//     //add item to DataBase
//     database.transaction(tx => {
//       tx.executeSql(
//         `INSERT INTO GeneralItems (title, category, description, method, image) VALUES (?, ?, ?, ?, ?)`, 
//         [this.state.ItemName, this.state.dropdown, this.state.Description, this.deliveryMethodHandler(),  this.state.ItemName + ' image'],
//         (txObj, resultSet) => console.log('Success', resultSet),
//         (txObj, error) => console.log('Error', error))
//     })

    
//     deleteHesitateItem(itemId);
//     //Navigate back to home page
//     this.props.navigation.navigate('Home')
//   } 

//   onValueChange = (flag,value) => {
//     if(flag ==1){
//     this.setState({selected:value});
//     }else{
//       this.setState({dropdown:value});
//     }
//   };  

//   handleupload = () =>{

//   }

//   render() {
//     const{ navigate } = this.props.navigation;
//     const { source, title, itemId } = this.props.route.params;
//     console.log(source);
//     return(
//       <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent'}}>
//         <KeyboardAvoidingView style = {{height: "50%", width: "100%", alignItems: 'center'}}>
//             <Image 
//                 style = {{flex: 5, height: "50%", width: "80%"}}
//                 source={{uri: source}}/>
//         </KeyboardAvoidingView>
//         <ScrollView style = {{width: "100%", backgroundColor: 'transparent'}}>
//             <View style ={styles.textContainer}>
//               <Text style = {styles.text}>物品標題</Text>
//             </View>
        
//             <View style ={styles.textInputContainer}>
//               <TextInput
//                   style={styles.input}
//                   //placeholder='ItemName'
//                   onChangeText={(text) => this.setState({ItemName: text})}
//                   value = {this.state.ItemName}/>
//             </View>
//             <View style ={styles.textContainer}>
//               <Text style={styles.text}>物品種類</Text> 
//             </View>
            
//             <View style ={styles.textInputContainer}>
//               <View style = {{flex: 0.5}}></View>
//               <View style = {{flex: 3.5, justifyContent: 'center'}}>
//                     <Picker
//                         mode={'dropdown'}
//                         //style={{height: 25,width:200}}
//                         selectedValue={this.state.dropdown}
//                         onValueChange={(value)=>this.onValueChange(2,value)}>
//                         <Picker.Item label="書籍" value="key0" />
//                         <Picker.Item label="衣服與配件" value="key1" />
//                         <Picker.Item label="玩具" value="key2" />
//                         <Picker.Item label="特色周邊品" value="key3" />
//                         <Picker.Item label="小型生活器具" value="key4" />
//                         <Picker.Item label="家電用品" value="key5" />
//                         <Picker.Item label="其他" value="key6" />
//                       </Picker>
//               </View>
//               <View style = {{flex: 6}}></View>
//             </View>

        

        

//           <View style={styles.textInputContainer}>
//             <View style = {{flex: 0.5}}></View>
//             <View style = {{flex: 9.5, flexDirection: 'row'}}>
//             {
//               this.state.dummyData.map((item, index)=>{
//                 return(
//                   <TouchableOpacity
//                     onPress={()=>this.selectionHandler(index)}
//                     title = 'upload'
//                     //onPress={this.handleupload}
//                     style = {item.isSelected ? styles.item : styles.itemS}>
//                     <Text style = {styles.buttonText}>{item.way}</Text> 
//                   </TouchableOpacity>
//                 );
//               })
//             }
//             </View>
//           </View>

//           <View style ={styles.textContainer}>
//               <Text style={styles.text}>物品說明</Text>
//           </View>
        
//           <View style = {{flex:3}}>
//               <TextInput
//                   style={styles.input}
//                   placeholder='second hand, not brandnew'
//                   onChangeText={(text) => {this.setState({Description: text}); console.log(this.state.Description)}}
//                   value = {this.state.Description}/>
//           </View>

        
        


//           {/* <TouchableOpacity
//               title = 'upload'
//               onPress={this.handleupload}
//               style = {styles.item}>
//               <Text
//                 style = {styles.buttonText}>Upload</Text>
//           </TouchableOpacity> */}
          
        
//           {/* <TouchableOpacity
//               title = 'Submit'
//               onPress={()=>this.handlesubmit(itemId)}
//               style = {styles.item}>
//               <Text
//                 style = {styles.buttonText}>Submit</Text>
//           </TouchableOpacity> */}
  
//           <View style = {styles.uploadContainer}>
//                 <TouchableOpacity
//                     title = 'Submit'
//                     onPress={()=>this.handlesubmit(itemId)}
//                     style = {styles.item}>
//                     <Image
//                       style = {{height: 70, width:70,}} 
//                       source = {require('../../assets/breakAway/upload.png')}/>
//                 </TouchableOpacity>
//           </View>
//         </ScrollView>
//         {/* <Button
//             title = 'Go to home screen'
//             onPress={() => navigate('Home')}/> */}
//       </View>
//     )
//   }

// }

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
  buttonAdd: {
    flex: 1.2,
    height: "100%",
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAddContainer: {
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