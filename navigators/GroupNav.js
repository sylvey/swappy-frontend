import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Group_ADD from '../screens/Group/Group_add';
import Group_HOME from '../screens/Group/Group_home';
import GroupDetails from '../screens/Group/GroupDetail';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { useLayoutEffect } from 'react';


const MyStack = createStackNavigator();

function Group() {

  return (
    <MyStack.Navigator
      initialRouteName="Home"
    >
      <MyStack.Screen 
        name="Home" 
        component={Group_HOME}
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


export default Group;
