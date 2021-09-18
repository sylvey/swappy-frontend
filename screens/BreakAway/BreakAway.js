import * as React from 'react';
import {
  ScrollView,
  Pressable,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
  TextInput
} from "react-native";
import _ from "lodash"; //MUST include for filtering lists (i.e. searching)
import { ProgressBar } from "react-native-paper";
import BreakAwaySpace from '../../Data/BreakAwaySpace';
import BreakAwayItems from '../../Data/BreakAwayItems';
import colors from '../../config/colors'
import { useState } from 'react';

import * as SQLite from 'expo-sqlite'
const database = SQLite.openDatabase('db.SwappyDataBase'); // returns Database object
import { deleteHesitateItem, deleteSpace } from '../../localStorageApi/api';

import { createMySpacesTable, createSpace } from '../../localStorageApi/api'
import { parse } from 'fecha';

import { Dimensions } from 'react-native';
import { fixObservableSubclass } from '@apollo/client/utilities';

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
const LEVELPOINTS = 20



export default class BreakAway extends React.Component {


  state = {
    spaceData: [],
    hesitateData: [],
    itemData: [],
    shouldShow: false,
    newSpaceName: '',
    spaceName: '',
    textinputShow: false,
  }


  static navigationOptions = {
    title: 'BreakAway',

  }


  renderSpace = ({ item }) => {
    //console.log('space',item);
    return (
      //console.log(this.props.navigation);
      <TouchableOpacity
        onLongPress={() => this.handleDelete(item)}
        onPress={() => this.props.navigation.navigate("BreakAwaySpaceDetail", { spaceId: item.id, complete: item.progress, spaceName: item.spaceName })}
        style={styles.button}
      >
        <View style={styles.buttonTitleC}>
          <Text style={styles.buttonTitle}>{item.spaceName}</Text>
        </View>

        <View style={styles.probarC}>
          <ProgressBar
            progress={((item.progress) % LEVELPOINTS) / LEVELPOINTS}
            style={styles.probarStyle}
            color={colors.function_100} />
        </View>
      </TouchableOpacity>

    )
  };



  handleX = () => {

  }


  getSpaceName = (spaceId) => {
    if (spaceId == 0) {
      this.setState({
        spaceName: '尚未選擇空間！',
      });
    } else {
      database.transaction(tx => {
        tx.executeSql('SELECT spaceName FROM MySpaces WHERE id = ? LIMIT 1',
          [spaceId],
          (txObj, resultSet) => {
            console.log('Success', resultSet);
            let spaceName = resultSet.rows._array[0]?.spaceName;
            console.log('spaceName', spaceName);
            
            this.setState({
              spaceName,
            });
            //return (spaceName)

          },
          (txObj, error) => console.log('Error', error))
      })
    }
  };

  handleDelete = (item) => {

    console.log(item);
    Alert.alert(
      "刪除此空間？",
      "",
      [
        {
          text: "確定",
          onPress: () => {
            //console.log("Cancel Pressed");
            deleteSpace(item.id);
          },
          style: "cancel"
        },
        { text: "取消", onPress: () => console.log("OK Pressed") }
      ]);
  }

  // deleteSpaceAlert = () => 

  handleAddSpace = () => {
    createMySpacesTable();
    createSpace(this.state.newSpaceName);
    this.setState({ newSpaceName: "", textinputShow: false });
  }


  renderImage = ({ item }) => {
    //console.log('image', item);
    // this.getSpaceName(item.id);
    this.getSpaceName(item.spaceName)
    //const spaceName1 = this.getSpaceName(item.spaceName)
    const reminderDate = parse(item.reminderDate, 'isoDate');
    const todayDate = new Date();
    const diffDays = Math.round((reminderDate - todayDate) / (24 * 60 * 60 * 1000));
    //console.log(diffDays);

    console.log(item);
    return (

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("BreakAwayItemDetail", { itemId: item.id, title: item.title, source: item.image, spaceId: item.spaceId, spaceName: item.spaceName, story: item.story, uploadDate: item.uploadDate })}
        style={{ width: ScreenWidth * 0.3, height: ScreenWidth * 0.3, marginHorizontal: ScreenWidth * 0.03, alignSelf: 'center' }}
      >
        <Image
          style={{ width: "95%", height: "95%", marginLeft: "5%" }}
          source={{ uri: item.image }} />

        <View style={diffDays > 0 ? styles.timeTag : styles.timeTagW}>
          <Text
            style={{
              color: colors.mono_40,
              marginHorizontal: "2%",
              fontSize: ScreenWidth * 0.3 * 0.1
            }}>{Math.abs(diffDays)}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  getSpaces = () => {
    // database.transaction(tx => {
    //   tx.executeSql(
    //     "DROP TABLE MyHesitatingItems"
    //   );}
    // );
    database.transaction(tx => {
      tx.executeSql('SELECT * FROM MySpaces',
        null,
        (txObj, resultSet) => {
          //console.log('Success', resultSet);
          let spacesData = resultSet.rows._array;
          this.setState({
            spaceData: spacesData,
          });
          //console.log(this.state.spaceData);
        },
        (txObj, error) => console.log('Error', error))
    });
  }

  getHesitateItems = () => {
    database.transaction(tx => {
      tx.executeSql('SELECT * FROM MyHesitatingItems1',
        null,
        (txObj, resultSet) => {
          //console.log('Success', resultSet);
          let hesitateData = resultSet.rows._array;
          this.setState({
            hesitateData: hesitateData,
          });
          //console.log(hesitateData);

        },
        (txObj, error) => console.log('Error', error))
    });
  }




  componentDidMount() {
    //database._db.close();
    //this.getSpaces();
    this.setState({
      //spaceData: BreakAwaySpace,
      itemData: BreakAwayItems,
    });
  }


  render() {
    this.getSpaces();
    this.getHesitateItems();
    // const[grvalue, grsetValue] = useState('');
    const { navigate } = this.props.navigation;
    //console.log(this.props.navigation);
    const { shouldShow, textinputShow } = this.state;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ height: 30, backgroundColor: 'transparent' }}></View>
        <View style={{ height: ScreenWidth*0.4, backgroundColor: 'transparent' }}>
          <FlatList
            data={this.state.hesitateData}
            renderItem={this.renderImage}
            horizontal={true}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.line}></View>

        <ScrollView 
          style={{ flex: 6, backgroundColor: 'transparent' }}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',}}>
          <View style={{ flex: 3, width: "100%", }}>
            <ScrollView
              style={{ flex: 5, backgroundColor: 'transparent' }}
              contentContainerStyle={{ justifyContent: 'center', }}
            >
              <FlatList
                data={this.state.spaceData}
                renderItem={this.renderSpace}
                keyExtractor={item => item.id}
              />
              {
                  this.state.textinputShow?(
                    <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholderTextColor={colors.function_100}
                          onChangeText={(text) => this.setState({ newSpaceName: text })}
                          value={this.state.newSpaceName} />
                        <TouchableOpacity
                          onPress={() => this.setState({ newSpaceName: "", textinputShow: false })}
                          style={{
                            right: "1%",
                            width: "7%",
                            height: "100%",
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                            }}
                            source={require('../../assets/breakAway/delete.png')} />
                        </TouchableOpacity>
                          
                        <TouchableOpacity
                          onPress={() => this.handleAddSpace()}
                          style={{
                            right: 0,
                            width: "7%",
                            height: "100%",
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                            }}
                            source={require('../../assets/breakAway/ok.png')} />
                        </TouchableOpacity>
                      </View>

                  ):
                  (
                    <View style={styles.inputContainerA}>
                      <TouchableOpacity
                        style = {{width:"100%", height:"100%", alignItems:'center', justifyContent:'center',}}
                        onPress ={() => this.setState({textinputShow: true})}>
                          <Image
                            style = {{ height: 20, width:20, tintColor: colors.mono_80}}
                            source = {require('../../assets/breakAway/add.png')}/>

                      </TouchableOpacity>
                    </View>
                  )
              }
              

            </ScrollView>

          </View>
          {/* <View style = {{flex:0.4, backgroundColor: 'green', }}></View> */}

        </ScrollView>

        {
          this.state.shouldShow ? (
            <View style={{ position: 'absolute', width: "100%", flexDirection: 'row', height: 20, alignItems: 'center', bottom: '20%', backgroundColor: 'transparent' }}>
              <View style={{ flex: 1, alignItems: 'center', left: ScreenWidth * 0.11, backgroundColor: 'transparent' }}>
                <TouchableOpacity
                  style={styles.buttonRoundhech}
                  onPress={() => navigate("BreakAwayHesitate")}
                >
                  <Image
                    style={styles.buttonRoundhech}
                    source={require('../../assets/breakAway/猶豫.png')} />
                  <Text style={styles.hech}>猶豫</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, alignItems: 'center', right: ScreenWidth * 0.11, backgroundColor: 'transparent' }}>
                <TouchableOpacity
                  style={styles.buttonRoundhech}
                  onPress={() => navigate("BreakAwayChangeOut")}
                >
                  <Image
                    style={styles.buttonRoundhech}
                    source={require('../../assets/breakAway/換出.png')} />
                  <Text style={styles.hech}>換出</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }

        <TouchableOpacity
          style={styles.buttonRound}
          onPress={() => this.setState({ shouldShow: !shouldShow })}
        >
          <Image
            style={styles.buttonRound}
            source={require('../../assets/breakAway/camera.png')} />
        </TouchableOpacity>


      </View>


    )
  }

}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.function_80,
    width: "90%",
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  probarStyle: {
    width: "100%",
    borderRadius: 5,
    height: 10,
    backgroundColor: colors.mono_60
  },
  probarC: {
    flex: 7,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 32,
  },
  image: {
    width: ScreenWidth * 0.2,
    height: ScreenWidth * 0.2,
  },
  button: {
    //flex:1,
    margin: 4,
    width: "90%",
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    alignSelf: 'center',
    //justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.function_100,
  },
  buttonTitleC: {
    flex: 2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  timeTag: {
    height: "15%",
    width: "30%",
    backgroundColor: colors.function_100,
    marginTop: "-7%",
    borderRadius: ScreenWidth * 0.3 * 0.075,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeTagW: {
    height: "15%",
    width: "30%",
    backgroundColor: colors.warning_80,
    marginTop: "-7%",
    borderRadius: ScreenWidth * 0.3 * 0.075,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button2: {
    margin: 4,
    width: 350,
    height: 60,
    backgroundColor: "#E0E0E0",
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonRoundhech: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRound: {
    position: 'absolute',
    width: 65,
    height: 65,
    bottom: "10%",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // width: 65,
    //   height: 65,
    //   position: 'absolute',
    //   borderRadius: 31.5,
    //   backgroundColor: 'transparent',
    //   bottom: ScreenHeight*0.07,
    //   //right: 169,
    //   alignSelf: 'center',
    //   justifyContent: 'center',
  },
  input: {
    //top: 14,
    color: colors.mono_80,
    left: 10,
    height: "90%",
    width: "85%",
    borderWidth: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    marginLeft: "5%",
    height: 40,
    width: "90%",
    borderWidth: 1,
    //borderRadius:6,
    borderColor: colors.mono_80,
    backgroundColor: 'transparent',
  },
  inputContainerA: {
    flexDirection: 'row',
    marginLeft: "5%",
    height: 40,
    width: "90%",
    //borderWidth: 1,
    //borderRadius:6,
    backgroundColor: colors.mono_60,
    //backgroundColor: 'transparent',
  },
  hech: {
    fontSize: 10,
    color: colors.mono_100,
  }
});