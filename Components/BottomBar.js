import * as React from 'react';
import { View, Button, Text } from 'react-native';


function BottomBar({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Button 
            title="Home" 
            onPress={()=>{navigation.navigate("Home")}}/>
        <Button 
            title="Record" 
            onPress={()=>{navigation.navigate("Record")}}/>
        <Button 
            title="Personal" 
            onPress={()=>{navigation.navigate("Personal")}}/>
        <Button 
            title="Social" 
            onPress={()=>{navigation.navigate("Social")}}/> */}
    </View>
  );
}

export default BottomBar;