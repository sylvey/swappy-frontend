import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import colors from '../../config/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';



const SIGN_UP_MUTATION = gql`
mutation signUp($email: String!, $password: String!, $phone: String!, $username: String!) {
  signUp(input: { 
    email: $email, 
    password: $password,
    username: $username,
    phone: $phone,
  }) {
    token
    user {
      id 
      email
      username 
      phone
    }
  }
}`;

const signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone]  = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [passwordEyeImage, setPasswordEyeImage] = useState(require("../../assets/login/eye.png"));
  const navigation = useNavigation();


  // mutation[0] : A function to trigger the mutation
  // mutation[1] : result object 
  //{ data,error, loading }
  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);
  

  if (error) {
    Alert.alert('Error signing up. Try again');
    console.log(error);
  }

  if (data) {
    // save token
    AsyncStorage
      .setItem('token', data.signUp.token)
      .then(() => {
        // redirect home
        //Alert.alert('signed up successfully!');
        Alert.alert('signed up successfully!');
        navigation.navigate("login");
      })
  }




  const handlesubmit = () => {
    signUp({variables: { email, password, phone, username}});

    // //create firebase account
    // auth.createUserWithEmailAndPassword(email, password)
    //   .then((userCredential) => {
    //     // Signed in 
    //     var user = userCredential.user;
    //     user.updateProfile({
    //       displayName: username,
    //       photoURL: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png"
    //     }).then(() => {
    //       // Update successful
    //       // ...
    //     }).catch((error) => {
    //       // An error occurred
    //       // ...
    //     });  
        
    //   })
    //   .catch((error) => {
    //     var errorMessage = error.message;
    //     alert(errorMessage);
    //   });
      
  }

  const handlesetSecure1 = (now) =>{
    setSecure1(!now)
  }

  const handlesetSecure2 = (now) =>{
    setSecure2(!now)
  }
  
  return (
    <View style={{ flex: 1 , backgroundColor: colors.function_100}}>
      <View style = {{flex: 1, borderTopStartRadius:20, borderTopRightRadius:20, backgroundColor: colors.mono_40, alignItems:'center', justifyContent:'center'}}>
          
        <View style = {styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder='使用者名稱'
              onChangeText={setUsername}
              value = {username}/>
        </View>

        <View style = {styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder='電子郵件'
              onChangeText={setEmail}
              value = {email}/>
        </View>


        <View style = {styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder='手機號碼'
              onChangeText={setPhone}
              value = {phone}/>
        </View>

        <View style = {styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder='密碼'
              secureTextEntry = {secure1}
              onChangeText={setPassword}
              value = {password}/>

          <TouchableOpacity
              title='resetpassword'
              onPress = {()=>handlesetSecure1(secure1)}
              style ={{
                left: 150,
                top: 12,  
                width: 24, 
                height: 24,}}
            >
              <Image
                style ={{
                  width: 24, 
                  height: 24,
                  tintColor: secure1? colors.function_100 : colors.brown_40}} 
                source = {passwordEyeImage}/>
            </TouchableOpacity>
        </View>

        <View style = {styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder='重新確認密碼'
              secureTextEntry = {secure2}
              onChangeText={setCheckPassword}
              value = {checkPassword}/>

          <TouchableOpacity
              title='resetpassword'
              onPress = {()=>handlesetSecure2(secure2)}
              style ={{
                left:150,
                top: 12,  
                width: 24, 
                height: 24,}}
            >
              <Image
                style ={{
                  width: 24, 
                  height: 24,
                  tintColor: secure2? colors.function_100 : colors.brown_40}} 
                source = {passwordEyeImage}/>
            </TouchableOpacity>
        </View>

          <TouchableOpacity
              title = 'Submit'
              onPress={handlesubmit}
              style = {styles.submit}>
                {loading && <ActivityIndicator />}
              <Text
                style = {styles.buttonText}>註冊</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default signup;




const styles = StyleSheet.create({
  inputContainer:{
    flexDirection: 'row',
    margin:10,
    height: 48,
    width: 356,
    borderWidth: 1,
    borderRadius:6,
    borderColor: colors.function_100,
    backgroundColor: 'transparent',
  },
  // input: {
  //   margin:10,
  //   height: 40,
  //   width: 300,
  //   alignContent: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 0
  // },
  input: {
    top: 14,
    left: 10,
    height: 20.96,
    width: 167.72,
    borderWidth: 0,
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
  item: {
    backgroundColor: colors.function_100,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonText: {
    color: colors.mono_40,
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});