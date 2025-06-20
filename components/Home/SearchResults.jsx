import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const SearchResults = ({ data, input, setInput }) => {
  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={data}
        renderItem={({ itm }) => {
          if (itm?.name.toLowerCase().includes(input.toLowerCase())) {
            return (
              <View
                style={{ marginVertical: 10, gap: 10, flexDirection: "row" }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    padding: 10,
                    backgroundColor: "#4b6cb7",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{color:"white",fontSize:16}}>{itm?.name?.charAt(0)}</Text>
                </View>

                <View>
                  <Text style={{fontSize:16,fontWeight:"bold"}}>{itm?.name}</Text>
                  <Text style={{marginTop:5,color:"gray"}}>
                    {itm?.category} ({itm?.id})
                  </Text>
                </View>
              </View>
            );
          }
        }}
      />
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({});