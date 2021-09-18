import React, { useState } from "react";
import { View, Text} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import login from "../screens/Login/login";
import signup from "../screens/Login/signup";
import colors from "../config/colors";

export default class LoginSignupNav extends React.Component{
    

    render (){
        const Tab = createMaterialTopTabNavigator();
        return(  
            <Tab.Navigator
                initialRouteName="login"
                
                tabBarOptions={{
                    showLabel: false,
                    showIcon: true,
                    indicatorStyle:{height: 0},
                    labelStyle:{height: 0},
                    style: { 
                        bottom: 0,
                        marginTop: 30,
                        //elevation: 0,
                        backgroundColor: colors.function_100,
                        height:70,
                    }
                 }}
            >   
                <Tab.Screen 
                    name = "login"
                    component = {login}
                    options={{ 
                    tabBarIcon:({focused})=>(
                        <View style =  {{display: 'flex', left:  focused? 5: 10 , top: focused? 5: 10, width: 70}}>
                            <Text style = {{color: focused? colors.mono_40 : colors.mono_60, fontSize: focused? 20:15}}>登入</Text>
                        </View>
                      )}}
                />
                <Tab.Screen 
                    name = "signup"
                    component = {signup}
                    options={{ 
                        tabBarIcon:({focused})=>(
                            <View style =  {{display: 'flex', right: focused? 20: 15, top: focused? 5: 10, width: 70}}>
                                <Text style = {{color: focused? colors.mono_40 : colors.mono_60, fontSize: focused? 20:15}}>註冊</Text>
                            </View>
                          )}}
                
                />
            </Tab.Navigator>
            
        )
    }
    
} 

