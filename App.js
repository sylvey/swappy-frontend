import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigators/Bottom_tab';
import TopTabNavigator from './navigators/ggtab'
import Root from './navigators/root'

//Apollo client
import { client } from './apollo';
import { ApolloProvider,gql } from '@apollo/client';

import {LogBox} from 'react-native'
LogBox.ignoreAllLogs(true)
// client
//   .query({
//     query: gql`
//     query generalItemsList {
//       generalItemsList {
//         title
//         description
//       }
//     }
//     `
//   })
//   .then(result => console.log(result))
//   .catch(err => console.log(err));

export default function App() {
  
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Root/>
      </NavigationContainer>
    </ApolloProvider>
  );
}


// import * as React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// function GeneralScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// function Screen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Details Screen</Text>
//     </View>
//   );
// }

// const Stack = createStackNavigator();

// function App() {
//   return (

//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="General">
//         <Stack.Screen name="GeneralScreen" component={GeneralScreen} options={{ title: 'Overview' }}/>
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
