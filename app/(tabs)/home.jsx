// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React from 'react';
// import { Pressable, StyleSheet, Text, View } from 'react-native';
// import Header from '../../components/Home/Header';
// import ItemListByCategory from '../../components/Home/ItemListByCategory';
// import Slider from '../../components/Home/Slider';
// import Colors from '../../constant/Colors';


// export default function Home() {

//   const router=useRouter();
//   const handlePress = () => {
//     router.push('/add-new-items');
//   };
//   return (
//     <View style={{padding:20,flex:1}}>
//    <Header/>
//    <Slider/>
//    <ItemListByCategory/>

//       <Pressable onPress={handlePress}
//        style={styles.container}>
//       <MaterialCommunityIcons name="necklace" size={24} color={Colors.PRIMARY} />
//         <Text style={{fontFamily:'outfit-medium',
//           color:Colors.PRIMARY
//         }}>
//           Add New Product
//         </Text>
//       </Pressable>
  
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container:
//   {display:'flex',
//     flexDirection:'row',
//     gap:10,
//     textAlign:'center',
//     alignItems:'center',
//     padding:20,
//     marginTop:20,
//     backgroundColor:Colors.LIGHT_PRIMARY,
//     borderWidth:1,
//     borderColor:Colors.PRIMARY,
//     borderRadius:15,
//     borderStyle:'dashed',
//     justifyContent:'center'
//   }
// })













// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useState, useRef } from 'react';
// import {
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   PanResponder,
//   Animated,
// } from 'react-native';

// import Header from '../../components/Home/Header';
// import ItemListByCategory from '../../components/Home/ItemListByCategory';
// import Slider from '../../components/Home/Slider';
// import Colors from '../../constant/Colors';
// import { ImageBackground } from 'react-native';

// export default function Home() {
//   const router = useRouter();

//   const handlePress = () => {
//     router.push('/add-new-items');
//   };

//   // Animated value for cart position
//   const pan = useRef(new Animated.ValueXY({ x: 300, y: 500 })).current;

//   // PanResponder for drag
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//         useNativeDriver: false,
//       }),
//       onPanResponderRelease: () => {
//         pan.extractOffset(); // Save the final position
//       },
//     })
//   ).current;

//   return (
//         <ImageBackground 
//           source={require('../../assets/images/background.jpg')} 
//           style={styles.container}
//           resizeMode="cover"
//         >
//     <View style={{ flex: 1,backgroundColor:'' }}>
//       <FlatList
//         data={[]}
//         ListHeaderComponent={
//           <View style={styles.container}>
//             <Slider />
//             <ItemListByCategory  />
//             {/* <Pressable onPress={handlePress} style={styles.addButton}>
//               <MaterialCommunityIcons name="necklace" size={24} color={Colors.PRIMARY} />
//               <Text style={styles.addButtonText}>Add New Product</Text>
//             </Pressable> */}
//           </View>
//         }
//       />

//       {/* Draggable Floating Cart Button */}
//       <Animated.View
//         {...panResponder.panHandlers}
//         style={[pan.getLayout(), styles.cartButton]}
//       >
//         <Pressable onPress={() => router.push('/cart')}>
//           <MaterialCommunityIcons name="cart" size={28} color="white" />
//         </Pressable>
//       </Animated.View>
//     </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   addButton: {
//     flexDirection: 'row',
//     gap: 10,
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 20,
//     backgroundColor: Colors.LIGHT_PRIMARY,
//     borderWidth: 1,
//     borderColor: Colors.PRIMARY,
//     borderRadius: 15,
//     borderStyle: 'dashed',
//     justifyContent: 'center',
//   },
//   addButtonText: {
//     fontFamily: 'outfit-medium',
//     color: Colors.PRIMARY,
//   },
//   cartButton: {
//     position: 'absolute',
//     backgroundColor: Colors.PRIMARY,
//     borderRadius: 30,
//     padding: 15,
//     elevation: 5, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
// });





















import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Config/Firebaseonfig';

import ItemListByCategory from '../../components/Home/ItemListByCategory';
import Slider from '../../components/Home/Slider';
import Colors from '../../constant/Colors';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real-time cart listener
  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const email = user.primaryEmailAddress.emailAddress;
    const docRef = doc(db, 'UserCartItem', email);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data();
      const count = data?.cart ? Object.keys(data.cart).length : 0;
      setCartItemCount(count);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // The real-time listener will automatically update when data changes
  }, []);

  // Animated value for cart position
  const pan = useRef(new Animated.ValueXY({ x: 300, y: 500 })).current;

  // PanResponder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  const renderHeader = useCallback(() => (
    <View style={styles.container}>
      <Slider />
      <ItemListByCategory />
    </View>
  ), []);

  if (loading) {
    return (
      <ImageBackground 
        source={require('../../assets/images/background.jpg')} 
        style={[styles.container, styles.loadingContainer]}
        resizeMode="cover"
      >
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/background.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={[]}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.PRIMARY]}
              tintColor={Colors.PRIMARY}
            />
          }
          keyExtractor={() => 'header'}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={5}
        />

        {/* Draggable Floating Cart Button with Badge */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[pan.getLayout(), styles.cartButton]}
        >
          <Pressable 
            onPress={() => router.push('/cart')} 
            style={styles.cartPressable}
          >
            <MaterialCommunityIcons name="cart" size={28} color="white" />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    position: 'absolute',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cartPressable: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: Colors.RED,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});