




























import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from './../../Config/Firebaseonfig';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import Colors from '../../constant/Colors';
import { TouchableOpacity } from 'react-native';

export default function Category({category}) {
  const [categoryList,setCategoryList]=useState([]);
  const [selectedCategory,setSelectedCategory]=useState('Watches')
  
  useEffect(()=>{
    GetCategories();
  },[])

  const GetCategories=async()=>{
    setCategoryList([]);
    const snapshot=await getDocs(collection(db,'Category'));
    snapshot.forEach((doc)=>{
      console.log(doc.data())
      setCategoryList(categoryList=>[...categoryList,doc.data()])
    })
  }
  
  return (
    <View style={{marginTop:20}}>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:20
      }}>Category</Text>

      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: 10}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index})=>(
          <TouchableOpacity 
            onPress={()=>{
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={{flex:1}}
          >
            <View style={[
              styles.container,
              selectedCategory==item.name && styles.selectedcon
            ]}>
              <Image source={{uri:item?.imageUrl}} style={{width:40,height:40}}/>
            </View>
            <Text style={{
              textAlign:'center',
              fontFamily:'outfit',
              marginTop: 5
            }}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.LIGHT_PRIMARY,
    padding:15,
    alignItems:'center',
    // borderWidth:1,
    borderRadius:15,
    borderColor:Colors.PRIMARY,
    margin:5
  },
  selectedcon:{
    backgroundColor:Colors.THIRD,
    // borderColor:Colors.THIRD
  }
})









