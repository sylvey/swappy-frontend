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
import BreakAwaySpace from '../../Data/BreakAwaySpace';

import * as SQLite from 'expo-sqlite'
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object

import colors from '../../config/colors';

import { deleteHesitateItem, createMyStoriesTable, createStoryItem, updateProgress } from '../../localStorageApi/api';


/* 2. Get the param */
export default class BreakAwayItemDetail extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      spaceName: '',
    }
  }

  renderImage = ({ item }) => {
    //console.log(item);
    return (
      <Image 
        style={{ width: 100, height: 100  }}
        source={item}/>
    );
  } 

  handleChangeOut = (itemId, title, source, story, spaceId) =>{
    
    // createStoryItem(title, story, source, spaceId);
    // const changeOutPoints = 2.0;
    // updateProgress(spaceId, changeOutPoints);
    this.props.navigation.navigate("BreakAwayItemChangeOut", {itemId: itemId, title: title, source: source, spaceId: spaceId, story: story})
  }

  handleKeep = (itemId, title, source, story, spaceId) =>{
    createStoryItem(title, story, source, spaceId);
    deleteHesitateItem(itemId);

    const keepPoints = 2.0
    updateProgress(spaceId, keepPoints);
    this.props.navigation.goBack()
  }


  getSpaceName = (spaceId) => {
    if(spaceId == 0) {
      this.setState({
        spaceName:'尚未選擇空間！',
      });
    } else {
      database.transaction(tx => {
        tx.executeSql('SELECT spaceName FROM MySpaces WHERE id = ? LIMIT 1', 
        [spaceId],
        (txObj, resultSet) => {
            //console.log('Success', resultSet);
            let spaceName = resultSet.rows._array[0].spaceName;
            //console.log(spaceName);
            this.setState({
              spaceName,
            });
    },
        (txObj, error) => console.log('Error', error))
    })
    }
};

componentDidMount() {
  createMyStoriesTable();
  this.getSpaceName(this.props.route.params.spaceId);
}
  
  render(){  
    const { itemId, title, source, spaceId, story, uploadDate, spaceName} = this.props.route.params;
    //console.log(spaceName);
    console.log('source', source);
    console.log('itemId', itemId);
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
              <Text style = {{right: "15%", fontSize: 20, color: colors.function_100}}>{title}</Text>
          </View>
        </View>

        {/* <FlatList
              style = {{margin: 20}}
              data={source}
              renderItem={this.renderImage}
              horizontal = {true}
          /> */}
        <View style = {{flex: 10, backgroundColor: colors.mono_40, width: "100%", alignItems: 'center' }}>
            <Image 
              style = {{flex: 5, height: "50%", width: "80%"}}
              source={{uri:source}}/>
            
            <View style = {styles.line}></View>
            <View style = {{flex: 4.4, width: "100%"}}>

              <View style = {{flex: 1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品空間 </Text>
                <Text>{spaceName}</Text>
              </View>
              
              <View style = {{flex:1, flexDirection: 'row'}}>
                <View style = {styles.margin}></View>
                <Text style = {styles.textT}>物品故事 </Text>
              </View>

              <View style = {{flex:7, flexDirection: 'row', height: "10%"}}>
                <View style = {styles.margin}></View>
                <View style = {styles.desContainer}>
                  <Text>{story}</Text>
                </View>
                <View style = {styles.margin}></View>
              </View>

              <View style = {{flex: 3,}}></View>
                {/* <Text>Story: {story}</Text> */}

                {/* <View style= {{flexDirection: 'row'}}>
                    <TouchableOpacity
                          onPress={()=>this.handleChangeOut(itemId, title, source, story, spaceId)}
                          title = '換出'
                          style = {styles.item}>
                          <Text style = {styles.buttonText}>換出</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity
                          onPress={()=>this.handleKeep(itemId, title, source, story, spaceId)}
                          title = '留下'
                          style = {styles.item}>
                          <Text style = {styles.buttonText}>留下</Text> 
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>

        <View style= {{flexDirection: 'row',position: 'absolute',width: "100%", backgroundColor:'transparent', bottom: 60, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
                  onPress={()=>this.handleChangeOut(itemId, title, source, story, spaceId)}
                  title = '換出'
                  style = {{marginRight:10, backgroundColor: 'transparent', alignItems:'center', justifyContent:'center'}}>
                   <Image
                    style = {{height: 42, width:99}}
                    source = {require('../../assets/breakAway/換出1.png')}
                    />
            </TouchableOpacity>
            <TouchableOpacity
                  onPress={()=>this.handleKeep(itemId, title, source, story, spaceId)}
                  title = '留下'
                  style = {{marginLeft:10, backgroundColor: 'transparent', alignItems:'center', justifyContent:'center'}}>
                  <Image
                    style = {{height: 42, width:99}}
                    source = {require('../../assets/breakAway/留下.png')}
                    />
            </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  buttonsC:{
    width: "100%",
    position: 'absolute',
    bottom: "30%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText:{
    color: colors.mono_40,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttons: {
    width: "25%",
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.function_100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mono_100,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 3,
  },
  button:{
    width: "10%", 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent:'center'},
  line:{
    height: 2,
    backgroundColor: colors.mono_60,
    width: "82%",
  },
  buttonImage :{
    width: 23, 
    height:20.97, 
    backgroundColor:'transparent'},
  textT:{
    color: colors.function_100,
  },
  margin: { 
    width: "10%", 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent:'center'
  },
  desContainer: {
    width: "80%", 
    borderColor: colors.mono_60, 
    borderWidth: 2
  },
  

});