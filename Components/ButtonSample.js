import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button
} from 'react-native';

export default (props) => (
  <View style={styles.center}>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}/>
    </TouchableOpacity>
    <Button
      title="Learn More"
      color="#841584"
    />
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: '#ee6e73',
    bottom: 150,
    right: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});