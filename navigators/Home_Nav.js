import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TopBarNavigator from './ggtab';
//import { Text } from 'react-native';


const HomeStack = createStackNavigator();

function Home() {
    return (
      <HomeStack.Navigator>
        

        {/*tab*/}
        <HomeStack.Screen 
          name="Home" 
          component={TopBarNavigator}
          options={{headerShown: false}}
        />
        
      </HomeStack.Navigator>
    );
  }
  
  
  export default Home;