import { styleSheets } from 'min-document';
import React from 'react';
import { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation,  gql } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';

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
    Dimensions,
    ScrollView, 
    KeyboardAvoidingView,
    } from 'react-native';

// import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
// import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
// import * as SQLite from "expo-sqlite";
import colors from '../../config/colors';


let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;

const RESET_USER = gql`
  mutation resetUser($username: String!, $email: String!, $phone: String!, $password: String!, $avatar: String) {
    resetUser(username: $username, email: $email, phone: $phone, password: $password, avatar: $avatar) 
  }`;

const UPLOAD_FILE = gql`
  mutation uploadFile ($file: Upload!) {
    uploadFile(file: $file){
      url
    }
  }`;


const ResetUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [defaultImage, setDefaultImage] = useState(null);
    const [source, setSource] = useState(null);
    const navigation = useNavigation();

    const [resetUser] = useMutation(RESET_USER);
    const [uploadFile] = useMutation(UPLOAD_FILE, {
      onCompleted: data => console.log(data)
    });

    const handlesubmit = () => {
      const file = generateRNImage(source.uri, Math.random().toString(36).slice(-10));
      console.log(file);
      uploadFile({variables: { file: file }, uploadFileAsForm: true});

      resetUser({variables: {username:username, email:email, phone:phone, password:password, avatar: file.name}});
      navigation.goBack();
    }

    const generateRNImage = (uri, name) => {
      return uri ? new ReactNativeFile({
        uri,
        type:'image/png',
        name: `image_${name}.png`,
      }) : null;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });

        if (!result.cancelled) {
        
          setSource({uri: result.uri});
        }
    };

    useEffect(()=>{
        //setUsername('@sylvey');
        // setStars(4.2);
        setDefaultImage(require('../../assets/personal/DefaultProfile.png'));
    })

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





    return (
        <KeyboardAwareScrollView 
          style ={{ flex: 1 , backgroundColor: colors.mono_40}}
          contentContainerStyle ={{alignItems: 'center', justifyContent: 'center',}}>

        <ScrollView></ScrollView>
          <TouchableOpacity 
            style = {{marginBottom: 30}}
            onPress = {pickImage}> 
            <Image
              style={{ width: ScreenWidth*0.3, height: ScreenWidth*0.3, borderRadius: ScreenWidth*0.15 }}
              source={source? source: defaultImage} />
          </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder='使用者名稱'
              onChangeText={setUsername}
              value = {username}/>
            <TextInput
              style={styles.input}
              placeholder='電子郵件'
              onChangeText={setEmail}
              value = {email}/>

            <TextInput
              style={styles.input}
              placeholder='手機號碼'
              onChangeText={setPhone}
              value = {phone}/>

          <TextInput
              style={styles.input}
              placeholder='密碼'
              onChangeText={setPassword}
              value = {password}/>

          <TextInput
              style={styles.input}
              placeholder='重新確認密碼'
              onChangeText={setCheckPassword}
              value = {checkPassword}/>

          <TouchableOpacity
              title = 'Submit'
              onPress={handlesubmit}
              style = {styles.submit}>
              <Text
                style = {styles.buttonText}>重設</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
    


}

export default ResetUser;

const styles = StyleSheet.create({
    input: {
        margin:10,
        height: 40,
        width: 300,
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 0
    },
    buttonText: {
        color: colors.mono_40,
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 'bold',
      },
    submit: {
      borderRadius: 10,
      display:'flex',
      margin: 30,
      backgroundColor: colors.function_100,
      height: 40,
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
})
