import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import General_HOME from '../screens/General/General_home';
import GeneralDetails from '../screens/General/GeneralDetail';



const MyStack = createStackNavigator();

function General() {
  return (
    <MyStack.Navigator>

      <MyStack.Screen 
        name="Home" 
        component={General_HOME}
        options={{
          title:"",
          headerStyle:{
            backgroundColor: 'transparent',
            height: 0
          }
        }} />
      
    </MyStack.Navigator>
  );
}


export default General;