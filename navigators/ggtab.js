import React, { useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, Dimensions } from "react-native";
import General from './GeneralNav';
import Group from './GroupNav';
import colors from "../config/colors";

let ScreenWidth = Dimensions.get("window").width;



export default class TopBarNavigator extends React.Component{
    
    render (){
        const GgTab = createMaterialTopTabNavigator();
        return(  
            <GgTab.Navigator
                initialRouteName="General"           
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
                <GgTab.Screen 
                    name = "General"
                    component = {General}
                    options={{ 
                        tabBarIcon:({focused})=>(
                            <View style =  {{flex: 1, alignItems: 'center', alignSelf: 'center', width: ScreenWidth*0.3, }}>
                                <Text style = {{ bottom: 8, color: focused? colors.function_100 : colors.mono_60, fontSize: 20}}>一般換物</Text>
                            </View>
                          )}}
                />
                <GgTab.Screen 
                    name = "Group"
                    component = {Group}
                    options={{ 
                        tabBarIcon:({focused})=>(
                            <View style =  {{ flex: 1, alignItems: 'center', alignSelf: 'center', width: ScreenWidth*0.3,}}>
                                <Text style = {{ bottom: 8, color: focused? colors.function_100 : colors.mono_60, fontSize: 20}}>群組換物</Text>
                            </View>
                          )}}
                />
            </GgTab.Navigator>
            
        )
    }
    
} 

// export default function TopBarNavigator(){
//     return <GgTabs />
// }