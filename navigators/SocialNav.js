import React, { useState } from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View, Dimensions  } from "react-native";
import Main from './MainNav';
import MyCollection from './MyCollectionNav';

const SocialTab = createMaterialTopTabNavigator();
let ScreenWidth = Dimensions.get("window").width;
import colors from "../config/colors";
function SocialTabs(){
        const insets = useSafeAreaInsets();
    return(  
        
        <SocialTab.Navigator
            initialRouteName="Main"
            tabBarOptions={{
                showLabel: false,
                showIcon: true,
                indicatorStyle:{color: colors.function_100},
                
                style: { 
                    alignSelf:'center',
                    top: 63,
                    width: ScreenWidth * 0.6,
                    height: 40,
                    backgroundColor: 'transparent',
                }
             }}
        >   
            <SocialTab.Screen 
                name = "Main"
                
                component = {Main}
                options={{ 
                    headerShown: false,
                    tabBarIcon:({focused})=>(
                        <View style =  {{flex: 1, alignItems: 'center', alignSelf: 'center', width: ScreenWidth*0.3, }}>
                            <Text style = {{ bottom: 8, color: focused? colors.function_100 : colors.mono_60, fontSize: 20}}>全部</Text>
                        </View>
                      )}}
            />
            <SocialTab.Screen 
                name = "My Collection"
                component = {MyCollection}
                options={{ 
                    headerShown: false,
                    tabBarIcon:({focused})=>(
                        <View style =  {{ flex: 1, alignItems: 'center', alignSelf: 'center', width: ScreenWidth*0.3,}}>
                            <Text style = {{ bottom: 8, color: focused? colors.function_100 : colors.mono_60, fontSize: 20}}>收藏</Text>
                        </View>
                      )}}
            />
        </SocialTab.Navigator>
    )
} 

export default function Social(){
    return <SocialTabs/>
}