import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Colors from '../../constant/Colors';
import MarkCart from '../MarkCart';
import MarkFav from '../MarkFav';

export default function ItemList({ itm, showCart = true }) {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 40) / 2; // Calculate width based on screen size with padding

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/item-details',
          params: itm,
        })}
      style={[styles.container, { width: itemWidth }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: itm.imageUrl }}
          style={styles.image}
        />
        <View style={styles.favoriteIcon}>
          <MarkFav itm={itm} color={'black'} />
        </View>
      </View>

      <Text style={styles.name}>{itm.name}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.price}>RS {itm.price}</Text>
      </View>

      {showCart && (
        <View style={styles.cartButtonContainer}>
          <MarkCart itm={itm} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 3,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  name: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: Colors.PRIMARY,
    backgroundColor: Colors.LIGHT_PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'outfit-medium',
  },
  cartButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});





// import { useRouter } from 'expo-router';
// import React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Colors from '../../constant/Colors';
// import MarkFav from '../MarkFav';
// import MarkCart from '../MarkCart';

// export default function ItemList({ itm, showCart = true }) {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() =>
//           router.push({
//             pathname: '/item-details',
//             params: itm,
//           })}
     
//       >
//         <View style={styles.favoriteIcon}>
//           <MarkFav itm={itm} color={'black'} />
//         </View>

//         <Image
//           source={{ uri: itm.imageUrl }}
//           style={styles.image}
//         />
//       </TouchableOpacity>

//       <Text style={styles.name}>
//         {itm.name}
//       </Text>

//       <View style={styles.detailsContainer}>
//         <Text style={styles.weight}>
//           {itm.metalWeight}g
//         </Text>

//         <Text style={styles.price}>
//           RS {itm.price}
//         </Text>
//       </View>

//       {showCart && (
//         <View style={styles.cartButtonContainer}>
//           <MarkCart itm={itm} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
// padding:10,marginRight:15,backgroundColor:Colors.WHITE,
//           borderRadius:10
//   },
//   favoriteIcon: {
//     position: 'absolute',
//     zIndex: 1,
//     right: 10,
//     top: 10,
//   },
//   image: {
// width:150,
// height:135,
// objectFit:'cover',
// borderRadius:10
//   },
//   name: {
//     fontFamily: 'outfit-medium',
//     fontSize: 17,
//     marginTop: 10,
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   weight: {
//     color: Colors.GRAY,
//     fontFamily: 'outfit',
//   },
//   price: {
//     color: Colors.PRIMARY,
//     backgroundColor: Colors.LIGHT_PRIMARY,
//     paddingHorizontal: 7,
//     borderRadius: 10,
//     fontSize: 11,
//   },
//   cartButtonContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
// });