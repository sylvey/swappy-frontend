import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main_ADD from '../screens/Main/Main_add';
import Main_HOME from '../screens/Main/Main_home';
import MainDetails from '../screens/Main/Main_detail';



const MStack = createStackNavigator();

function Main() {
  return (
    <MStack.Navigator>

      <MStack.Screen 
        name="Home" 
        component={Main_HOME}
        options={{
          title:"",
          headerShown: false,
          
        }} />
    </MStack.Navigator>
  );
}


export default Main;