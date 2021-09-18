import * as React from 'react';

import { View,
       Text,
       Button, 
       Image, 
       FlatList, 
       SafeAreaView, 
       ScrollView, 
       TouchableOpacity,
       StyleSheet } from "react-native";

import { Dimensions } from 'react-native';
import _ from "lodash"; 
import { parse } from 'fecha';
import * as SQLite from 'expo-sqlite'
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object

import BreakAwayItems from '../../Data/BreakAwayItems';
import CircularProgress from 'react-native-circular-progress-indicator';
/* 2. Get the param */
import colors from '../../config/colors';
const LEVELPOINTS = 20;
let ScreenWidth = Dimensions.get("window").width;
const defaultDays = -100//just hardData


export default class BreakAwaySpaceDetail extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      hesitate: [], 
      fullData: [],
      hesitateItems: [],
      storyItems: []
    };
  }

  getHesitateItemsBySpace = (spaceId) => {
    database.transaction(tx => {
        tx.executeSql('SELECT * FROM MyHesitatingItems1 WHERE spaceId = ?', 
        [spaceId],
        (txObj, resultSet) => {
            //console.log('Success', resultSet);
            let item = resultSet.rows._array;
            this.setState({
              hesitateItems: item,
            });
            //console.log(this.state.hesitateItems);
    },
        (txObj, error) => console.log('Error', error))
    })
  };

  getStoryItemsBySpace = (spaceName) => {
    database.transaction(tx => {
        tx.executeSql('SELECT * FROM MyStoryItems WHERE spaceName = ?', 
        [spaceName],
        (txObj, resultSet) => {
            //console.log('Success', resultSet);
            let item = resultSet.rows._array;
            this.setState({
              storyItems: item,
            });
            console.log('storyitems',item);
    },
        (txObj, error) => console.log('Error', error))
    })
};

  renderHesitate = ({ item }) => {
    //console.log(item);
    const reminderDate = parse(item.reminderDate, 'isoDate');
    const todayDate = new Date();
    const diffDays = Math.round((reminderDate - todayDate) / (24 * 60 * 60 * 1000));
    //console.log(diffDays);
    return ( 
    <TouchableOpacity
        style ={styles.imageC}
        onPress = {() => this.props.navigation.navigate("BreakAwayItemDetail", {itemId: item.id, title: item.title, source: item.image, spaceId: item.spaceId, spaceName: this.props.route.params.spaceName, story: item.story, uploadDate: item.reminderDate})}
        >
        <Image 
          style={{ width: "95%", height: "95%", marginLeft: "5%"}}
          source={{uri: item.image}}/>

        <View style = {diffDays>0 ? styles.timeTag: styles.timeTagW }>
          <Text 
            style = {{
              color: colors.mono_40, 
              marginHorizontal: "2%", 
              fontSize: ScreenWidth* 0.3*0.1
              }}>{Math.abs(diffDays)}</Text>
        </View>
    </TouchableOpacity>
    
  )}

  renderStory = ({ item }) => ( 
    <TouchableOpacity
      style ={styles.imageC}
      onPress = {() => this.props.navigation.navigate("BreakAwayItemStory", {title: item.title, story: item.story, spaceName: this.props.route.params.spaceName, image: item.image, space: item.space})}
      >
        <Image 
          style={styles.image}
          source={{uri:item.image}}/>
    </TouchableOpacity>
  )




  
  render(){  
    const { spaceId, complete, spaceName } = this.props.route.params;
    this.getHesitateItemsBySpace(spaceId);
    this.getStoryItemsBySpace(spaceId);
    //console.log(spaceName);
    return (
      <View style={{ flex: 1, top: "5%", bottom:"20%", alignItems: 'center'}}>

        <View style = {{flex: 1, flexDirection: 'row', height: "7%", backgroundColor: colors.mono_40}}>
          <TouchableOpacity
            style = {{flex:2, width: "20%", backgroundColor: colors.mono_40, alignItems: 'center', justifyContent:'center'}}
            onPress = {()=>this.props.navigation.goBack()}
            >
            <Image 
              style = {{height: "25%", width: "25%"}}
              source = {require('../../assets/manyneed/xmark.png')}/>
          </TouchableOpacity>

          <View
            style ={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style = {{right: "15%", fontSize: 20, color: colors.function_100}}>{spaceName.toUpperCase()}</Text>
          </View>
        </View>

        <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
          <ScrollView style = {{flex: 10, height: "90%",alignContent:'center', width: "100%"}}>
            <View style = {styles.marginRow}></View>

            <View style = {{
                flex:4, 
                alignContent: 'center', 
                alignItems: 'center', 
                alignSelf:'center', 
                width: "100%",
                justifyContent: 'center',  
                backgroundColor: 'transparent'}}>
                <CircularProgress
                  value={(complete % LEVELPOINTS)}
                  radius={120}
                  activeStrokeColor={colors.function_100}
                  inActiveStrokeColor={colors.mono_60}
                  inActiveStrokeWidth={20}
                  activeStrokeWidth={20}
                  duration={2000}
                  textStyle={{ color: 'transparent' }}
                  maxValue={20}
                >
                </CircularProgress>
                <View style = {{position: 'absolute', alignItems: 'center', justifyContent:'center', backgroundColor: 'transparent'}}>
                  <Text style= {{ fontSize: 60, fontWeight: 'bold', color: colors.function_100 }}>{Math.floor(complete/LEVELPOINTS)}</Text>
                  <Text style= {{ fontSize: 30, color: colors.function_100, }}>等級</Text>
                </View>
            </View>
            
            <View style = {styles.marginRow}></View>
            
            <View style = {styles.textC, {alignItems:'center'}}>
                <Text style = {styles.text, {color: colors.mono_80}}>還差{Math.round((LEVELPOINTS-(complete % LEVELPOINTS))*10)/10}點經驗值升級</Text>
            </View>


            <View style = {{flex: 5, backgroundColor: 'transparent', width: "100%"}}>
                <View style = {styles.marginRow}></View>
                <View style = {{flex: 1}}>    
                    <View style = {styles.textC}>
                      <View style = {styles.margin}></View>
                      <Text style = {styles.text}>猶豫區</Text>
                    </View>          

                    <View  style = {styles.flatC}>
                      
                      <FlatList
                            style = {{flex: 1}}
                            data={this.state.hesitateItems}
                            renderItem={this.renderHesitate}
                            //numColumns={3}
                            horizontal = {true}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
                
                <View style = {styles.line}></View>
                <View style = {styles.marginRow}></View>
                <View style = {{flex: 1}}>
                    <View style = {styles.textC}>
                        <View style = {styles.margin}></View>
                        <Text style = {styles.text}>故事集</Text>
                    </View>  
                    <View style = {styles.flatC2}>
                        <FlatList
                              style = {{flex: 1,marginBottom:60}}
                              data={this.state.storyItems}
                              renderItem={this.renderStory}
                              numColumns={3}
                              horizontal = {false}
                              columnWrapperStyle={{}}
                              keyExtractor={item => item.id}
                          />
                    </View>
                </View>
            </View>
          </ScrollView>
          </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.function_100,
    width: "90%",
    alignSelf:"center",
  },
  marginRow:{
    height: 20,
    width: "100%",
    backgroundColor: 'transparent',
  },
  margin:{
    height: "100%",
    width: "5%",
    backgroundColor: 'transparent',
  },
  textC:{
      backgroundColor: 'transparent',
      flex: 1,
      alignItems: 'center',
      flexDirection:'row',
  },
  text:{
      color: colors.function_100,
      fontWeight:'bold',
      fontSize: 15,
  },
  flatC:{
      flex:4,
      backgroundColor: 'transparent',
      //alignItems: 'center',
      justifyContent:'center',
  },
  flatC2:{
    flex:4,
    backgroundColor: 'transparent',
    //alignItems: 'center',
    justifyContent:'center',
  },
  image:{
    width: "95%", 
    height: "95%",
    marginLeft:"5%",  
  },
  imageC:{
    //flexDirection: 'row', 
    width: ScreenWidth/3 -ScreenWidth*0.06, 
    height: ScreenWidth/3-ScreenWidth*0.06, 
    margin: ScreenWidth*0.03, 
    //alignItems: 'center', 
    justifyContent: 'center'
  },
  timeTag:{
    height:"15%",
    width: "30%", 
    backgroundColor: colors.function_100, 
    marginTop: "-7%", 
    borderRadius: ScreenWidth* 0.3*0.075, 
    alignItems:'center', 
    justifyContent:'center'
  },
  timeTagW:{
    height:"15%",
    width: "30%", 
    backgroundColor: colors.warning_80, 
    marginTop: "-7%", 
    borderRadius: ScreenWidth* 0.3*0.075, 
    alignItems:'center', 
    justifyContent:'center'
  },
});