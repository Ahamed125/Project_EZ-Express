import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Colors from '../../constant/Colors';

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color={Colors.GRAY} style={styles.icon}/>
        <TextInput
          placeholder='Search products...'
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.DARK,
  },
  icon: {
    marginRight: 5,
  },
});