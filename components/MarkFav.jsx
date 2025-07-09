// import { View, Text, Pressable } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { Ionicons } from '@expo/vector-icons'
// import Shared, { GetFavList } from '../Shared/Shared'
// import { useUser } from '@clerk/clerk-expo'
// export default function MarkFav({itm,color='black'}) {
//  const {user}=useUser();
//  const [favList,setFavList]=useState();
//     useEffect(()=>{
// user&&GetFav();
//     },[user])

//     const GetFav=async()=>{
//    const result = await Shared.GetFavList(user);
// //    console.log(result);
//    setFavList(result?.favorites?result?.favorites:[])
//     }
//     const AddToFav=async()=>{
//         const favResult=favList;
//         favResult.push(itm?.id)
//         await Shared.UpdateFav(user,favResult);
//         GetFav();
//     }
//     const removeFromFav=async() =>{
//         const favResult=favList.filter(item=>item!=itm.id);
//         await Shared.UpdateFav(user,favResult);
//         GetFav();
//     }
//   return (
//     <View>
//    {favList?.includes(itm.id)? <Pressable onPress={removeFromFav}>
//         <Ionicons name="heart" size={30} color="red" />
//      </Pressable>:
//      <Pressable onPress={()=>AddToFav()}>
//         <Ionicons name="heart-outline" size={30} color={color} />
//      </Pressable>}
//     </View>
//   )
// }















import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import Share from './../Shared/Share'

export default function MarkFav({ itm, color = 'black', size = 30 }) {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) checkFavoriteStatus();
  }, [user]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await Share.GetFavList(user);
      setIsFavorite(result?.favorites?.includes(itm?.id) || false);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const result = await Share.GetFavList(user);
      let currentFavorites = result?.favorites || [];
      
      if (isFavorite) {
        currentFavorites = currentFavorites.filter(id => id !== itm.id);
      } else {
        if (!currentFavorites.includes(itm.id)) {
          currentFavorites = [...currentFavorites, itm.id];
        }
      }
      
      await Share.UpdateFav(user, currentFavorites);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Pressable onPress={toggleFavorite} disabled={loading}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={size} 
          color={isFavorite ? "red" : color} 
        />
      </Pressable>
    </View>
  );
}