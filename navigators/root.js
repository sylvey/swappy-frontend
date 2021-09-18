import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import General_ADD from '../screens/General/General_add';
import GeneralDetailsScreen from '../screens/General/GeneralDetail';
import GroupDetailsScreen from '../screens/Group/GroupDetail';
import Group_ADD from '../screens/Group/Group_add';
import Main_ADD from '../screens/Main/Main_add';
import Tabs from './Bottom_tab';
//import BreakAwayADD from '../screens/BreakAway/BreakAwayADD';
import MainDetail from '../screens/Main/Main_detail';
import BreakAwayHesitate from '../screens/BreakAway/BreakAwayHesitate';
import GroupAddItem from '../screens/Group/GroupAddItem';
import Group_itemDetail from '../screens/Group/Group_itemDetail';
import Notification from './NotificationNav';
import BreakAwayItemDetail from '../screens/BreakAway/BreakAwayItemDetail';
import BreakAwayItemChangeOut from '../screens/BreakAway/BreakAwayItemChangeOut';
import BreakAwaySpaceDetail from '../screens/BreakAway/BreakAwaySpaceDetail';
import BreakAwayChangeOut from '../screens/BreakAway/BreakAwayChangeOut';
import SplashScreen from '../screens/Splash'
import login from '../screens/Login/login';
import signup from '../screens/Login/signup';
import LoginSignupNav from './loginSignupNav';
import colors from '../config/colors';
import BreakAwayItemStory from '../screens/BreakAway/BreakAwayItemStory';
import Notification_successDetail from '../screens/Notification/Notification_successDetail';
//import Notification_failDetail from '../screens/Notification/Notification_failDetail';
import Notification_waitingDetail from '../screens/Notification/Notification_waitingDetail';
import Notification_invitationDetail from '../screens/Notification/Notification_invitationDetail';
import Message_home from '../screens/Message/Message_home';
import GroupWishingPoolScreen from '../screens/Group/Group_wishingPool';
import ResetUser from '../screens/Personal/ResetUser';
import Record from '../screens/Personal/Record';
import RecordDetail from '../screens/Personal/RecordDetail';
import Star from '../screens/Personal/Star';
import Complete from '../screens/Personal/Complete';
import Notification_choiceDetail from '../screens/Notification/Notification_choiceDetail';
import Message_Detail from '../screens/Message/Message_Detail';
import AboutSwappy from '../screens/Personal/AboutSwappy';
//import { Text } from 'react-native';


const RootStack = createStackNavigator();

function Root() {
    return (
      
      <RootStack.Navigator>
        <RootStack.Screen 
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false
          }}
        />
        {/*login*/}
        <RootStack.Screen 
          name="loginSignup" 
          component={LoginSignupNav}
          options={{
            headerShown: false,
            cardStyle: {backgroundColor: colors.function_100}}}
        />
         {/* cardStyle: {backgroundColor: '#629D89'} */}


        {/*tab*/}
        <RootStack.Screen 
          name="BottomTab" 
          component={Tabs}
          options={{headerShown: false}}
        />


        {/*general*/}
        <RootStack.Screen 
          name="GeneralAdd" 
          component={General_ADD}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}
         />

        <RootStack.Screen 
          name="GeneralDetail" 
          component={GeneralDetailsScreen}
          options={{headerShown: false}}
        />

        {/*group*/}
        <RootStack.Screen 
          name="GroupAdd" 
          component={Group_ADD}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            },}}
        />
        <RootStack.Screen 
          name="GroupDetail" 
          component={GroupDetailsScreen}
          options={{
            headerShown: false,
          }}/>
        <RootStack.Screen 
          name="GroupWishingPool" 
          component={GroupWishingPoolScreen}
          options={{
            headerShown: false,
          }}/>

        <RootStack.Screen 
          name="GroupAddItem" 
          component={GroupAddItem}
          options={{
          title: '',
          cardStyle: {backgroundColor: colors.mono_40},
          headerStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0, 
          },
          headerTintColor: colors.warning_80,
          headerTitleStyle: {
            backgroundColor:'transparent',
            fontWeight: 'bold',
          },}}/>
        
        <RootStack.Screen 
          name="Group_itemDetail" 
          component={Group_itemDetail}
          options={{headerShown: false }}/>
        
        {/*social */}
        <RootStack.Screen 
          name="MainAdd" 
          component={Main_ADD}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}
         />

        <RootStack.Screen 
          name="MainDetail" 
          component={MainDetail}
          options={{headerShown: false}}
         />

        
        {/*break away */}
        {/* <RootStack.Screen 
          name="BreakAwayADD" 
          component={BreakAwayADD}
          options={{headerShown: false }}/> */}
        
        <RootStack.Screen 
          name="BreakAwayItemDetail" 
          component={BreakAwayItemDetail}
          options={{headerShown: false }}/>

        <RootStack.Screen 
          name="BreakAwayItemChangeOut" 
          component={BreakAwayItemChangeOut}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>

        <RootStack.Screen 
          name="BreakAwayItemStory" 
          component={BreakAwayItemStory}
          options={{headerShown: false }}/>

        <RootStack.Screen 
          name="BreakAwayHesitate" 
          component={BreakAwayHesitate}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>

        <RootStack.Screen 
          name="BreakAwayChangeOut" 
          component={BreakAwayChangeOut}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>
        
        <RootStack.Screen 
          name="BreakAwaySpaceDetail" 
          component={BreakAwaySpaceDetail}
          options={{
            headerShown:false}}/>

        {/*notification */}
        <RootStack.Screen 
          name="Notification" 
          component={Notification}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>
        
        <RootStack.Screen 
          name="NotificationSuccessDetail" 
          component={Notification_successDetail}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>
        
        <RootStack.Screen 
          name="NotificationWaitingDetail" 
          component={Notification_waitingDetail}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>
        
        <RootStack.Screen 
          name="Notification_choiceDetail" 
          component={Notification_choiceDetail}
          options={{
            headerShown: false 
          }}/>

        {/* <RootStack.Screen 
          name="NotificationFailDetail" 
          component={Notification_failDetail}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/> */}

        <RootStack.Screen 
          name="NotificationInvatationDetail" 
          component={Notification_invitationDetail}
          options={{
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>

        {/* message */}
        <RootStack.Screen 
          name="MessageHome" 
          component={Message_home}
          options={{
            headerShown: false, 
          }}/>

        <RootStack.Screen 
          name="MessageDetail" 
          component={Message_Detail}
          options={{
            headerShown: false, 
          }}/>

         {/* personal */}
        <RootStack.Screen 
          name="ResetUser" 
          component={ResetUser}
          options={{
            //headerShown: true,
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>

        <RootStack.Screen 
          name="Record" 
          component={Record}
          options={{
            headerShown: false,
          }}/>
        
        <RootStack.Screen 
          name="AboutSwappy" 
          component={AboutSwappy}
          options={{
            headerShown: false,
          }}/>

        <RootStack.Screen 
          name="RecordDetail" 
          component={RecordDetail}
          options={{
            //headerShown: true,
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>
        
        <RootStack.Screen 
          name="Star" 
          component={Star}
          options={{
            //headerShown: true,
            title: '',
            cardStyle: {backgroundColor: colors.mono_40},
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0, 
            },
            headerTintColor: colors.warning_80,
            headerTitleStyle: {
              backgroundColor:'transparent',
              fontWeight: 'bold',
            }, 
          }}/>

        <RootStack.Screen 
          name="Complete" 
          component={Complete}
          options={{
            headerShown: false,
             
          }}/>

      </RootStack.Navigator>
    );
  }
  
  
  export default Root;