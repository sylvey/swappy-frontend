import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, 
        Text, 
        StyleSheet, 
        TextInput,
        Alert, 
        KeyboardAvoidingView,
        ActivityIndicator,
        TouchableOpacity,
        Image } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from '../../config/colors';
import { useNavigation } from '@react-navigation/core';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation,  gql } from '@apollo/client';


const SIGN_IN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password}) {
      token
      user {
        username
        id
        email
      }
    }
  }`;



const login = () =>  {
  // constructor(props) {
  //   super(props);
  //   this.state = { 
  //     account: '', 
  //     password: '', 
  //     accountImage: require("../../assets/login/account.png"),
  //     passwordImage: require("../../assets/login/password.png"),
  //     passwordEyeImage: require("../../assets/login/eye.png"),
  //     secure: true,
  //    };
      
  // }

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [accountImage, setAccountImage] = useState(require("../../assets/login/account.png"));
  const [passwordImage, setPasswordImage] = useState(require("../../assets/login/password.png"));
  const [passwordEyeImage, setPasswordEyeImage] = useState(require("../../assets/login/eye.png"));
  const [secure, setSecure] = useState(true);
  
  const navigation = useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      Alert.alert('Invalid credentials, try again');
    }
  }, [error])

  if (data) {
    // save token
    console.log(data);
    AsyncStorage
      .setItem('userId', data.signIn.user.id)
      .then(()=> console.log("stored user ID!"));
    
    AsyncStorage
      .setItem('token', data.signIn.token)
      .then(() => {
        // redirect home
        Alert.alert('signed in successfully!');
        navigation.navigate("BottomTab")
      })
  }

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(function (user) {
  //   if (user) {
  //     console.log('signed in!');
  //   } else {
  //   // No user is signed in.
  //   }
  //   });
  //   return unsubscribe;
  //   }, [])


  const handlesubmit = () => {
      // auth.signInWithEmailAndPassword(account, password)
      // .catch((error) => {
      //   var errorMessage = error.message;
      //   alert(errorMessage)
      // });
    
    signIn({ variables: { email: account, password }})
    //navigation.navigate("BottomTab")
  }

  const handlesetSecure = (now) =>{
    setSecure(!now)
  }

  
  return (
    <View style={{ flex: 1 , backgroundColor: colors.function_100}}>
      <KeyboardAvoidingView 
        style = {{flex: 1, borderTopStartRadius:20, borderTopRightRadius:20, backgroundColor: colors.mono_40, alignItems:'center', justifyContent:'center'}}
        behavior='padding'
        enabled>

        <View style = {styles.inputContainer}>
            <Image
              style={styles.image}
              source={accountImage} />
            <TextInput
              style={styles.input}
              placeholderTextColor = {colors.function_100}
              placeholder='電子郵件'
              onChangeText={setAccount}
              value={account} />
        </View>
        
        <View style = {styles.inputContainer}>
            <Image
              style={styles.image}
              source={passwordImage} />
            <TextInput
              style={styles.input}
              placeholderTextColor = {colors.function_100}
              placeholder='密碼'
              secureTextEntry = {secure}
              onChangeText={setPassword}
              value={password} />   

            <TouchableOpacity
              title='resetpassword'
              onPress = {()=>handlesetSecure(secure)}
              style ={{
                left: 110,
                top: 12,  
                width: 24, 
                height: 24,}}
            >
              <Image
                style ={{
                  width: 24, 
                  height: 24,
                  tintColor: secure? colors.function_100 : colors.brown_40}} 
                source = {passwordEyeImage}/>
            </TouchableOpacity>
        </View>                
        
        <View style = {{left: 100, flexDirection: 'row'}}>
            <Text style = {{color: colors.mono_80}}>找不到密碼嗎？ </Text>
            <TouchableOpacity
              title='resetpassword'
            >
              <Text
                style={{ color: colors.function_100 }}>重設密碼</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
          title='Submit'
          disabled={loading}
          onPress={handlesubmit}
          style={styles.submit}>
            {loading && <ActivityIndicator />}
          <Text
            style={styles.buttonText}>登入</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
          </View>
  );
  
}

export default login;

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
  image:{
    marginLeft: 13,
    top: 12,  
    width: 24, 
    height: 24,  
  },
  input: {
    top: 14,
    left: 10,
    height: 20.96,
    width: 167.72,
    borderWidth: 0,
  },
  eye:{
     
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
  buttonText: {
    color: colors.mono_40,
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});