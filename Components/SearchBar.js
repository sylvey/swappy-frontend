import React, { useState } from "react";
import {
    View,
    Button,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from "react-native";
import colors from "../config/colors";

  export default function Searchbar({ value, updateSearch, style }) {

    const [query, setQuery] = useState(value);
    const [error, setError] = useState()
    return (
        <View style={[styles.container, style]}>
          <View style={styles.searchContainer}>
                <View style={styles.vwSearch}>
                    <Image
                        style={styles.icSearch}
                        source={require('../assets/ic_search.png')} />
                </View>

                <TextInput
                    value={query}
                    placeholder="Search"
                    style={styles.textInput}
                    onChangeText={(text) => {
                        var letters = /^$|^[a-zA-Z._\b ]+$/;
                        if (text.length > 12)
                            setError("Query too long.")
                        else if (text.match(letters)) {
                            setQuery(text)
                            updateSearch(text)
                            if (error)
                                setError(false)
                        }
                        else setError("Please only enter alphabets")
                    }}
                />
                {
                    query ?
                        <TouchableOpacity
                            onPress={() => setQuery('')}
                            style={styles.vwClear}>
                            <Image
                                style={styles.icClear}
                                source={require('../assets/ic_clear.png')} />
                        </TouchableOpacity>
                        : <View style={styles.vwClear} />
                }

            </View>
            {
                error &&
                <Text style={styles.txtError}>
                    {error}
                </Text>
            }
        </View >
    )
}

const styles = StyleSheet.create({
  txtError: {
      marginTop: '2%',
      width: '90%',
      color: 'white',
  },
  vwClear: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
  },
  textInput: {
      // backgroundColor: 'green',
      flex: 1,
  },

  vwSearch: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      // width: 40,
      backgroundColor: 'white'
  },
  icSearch: {
      height: 18, 
      width: 18,
      color: colors.brown_100,
  },
  searchContainer:
  {
      backgroundColor: 'white',
      width: '90%',
      height: 80,
      flexDirection: 'row'

  },
  container: {
      height: 80,
      alignItems: 'center',
      backgroundColor: 'white',
      
      // height: '100%', width: '100%' 
  },
});