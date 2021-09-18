import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';

import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat } from 'react-native-gifted-chat'


const ChatScreen = ({ navigation}) => {
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
        snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
        }))
        ));
        return unsubscribe;
        }, [])
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
      const {
        _id,
        createdAt,
        text,
        user,
        } = messages[0]
        db.collection('chats').add({
            _id,
            createdAt,
            text,
            user
        })
    }, [])

  const signOut = () => {
    auth.signOut().then(() => {
    // Sign-out successful.
    navigation.replace("Login");
    }).catch((error) => {
    // An error happened.
    });
    }

    useLayoutEffect(() => {
      navigation.setOptions({ 
          headerLeft: () => (
            <View style={{ marginLeft: 20 }}>
                <Avatar
                rounded
                source={{uri: auth?.currentUser?.photoURL,}}/>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 30 }}
              onPress = {signOut}>
                <AntDesign name="logout" size={24} color="black" />
            </TouchableOpacity>)
      })
    }, [navigation])

    return (
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage = {true}
          onSend={messages => onSend(messages)}
          user={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL
          }}
        />
      )
  }

export default ChatScreen;