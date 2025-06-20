import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
//@ts-ignore
import { collection, getDocs, query, where } from 'firebase/firestore'
import { FlatList } from 'react-native'
import { db } from '../../Config/Firebaseonfig'
import Category from './Category'
import ItemList from './ItemList'





export default function ItemListByCategory() {
    const [itemList,setItemList]=useState([]);
     const [loader,setLoader]=useState(false);
    useEffect(()=>{
GetItemList('Watches')
    },[])
    /** 
    *@param {*} category
*/
    const GetItemList=async(category)=>{
      setLoader(true)
        setItemList([]);
        const q=query(collection(db,'Items'),where('category','==',category));
        const querySnapshot=await getDocs(q);

        querySnapshot.forEach(doc=>{
            // console.log(doc.data());
            setItemList(itemList=>[...itemList,doc.data()])
        })
       setLoader(false);
    }
  return (
    <View>
      <Category category={(value)=>GetItemList(value)}/>
        <FlatList
        data={itemList}
        horizontal={true}
        refreshing={loader}
        onRefresh={()=>GetItemList('Watches')}
        style={{marginTop:15}}
        renderItem={({item,index})=>(
            <ItemList itm={item}/>
        )}
        />
    </View>
  )
}




















// import React, { useEffect, useState } from 'react';
// import { View, FlatList, ActivityIndicator, Text } from 'react-native';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../Config/Firebaseonfig';
// import Category from './Category';
// import ItemList from './ItemList';
// import Colors from '../../constant/Colors';

// export default function ItemListByCategory() {
//     const [itemList, setItemList] = useState([]);
//     const [filteredItems, setFilteredItems] = useState([]);
//     const [loader, setLoader] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState('Watches');
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         GetItemList(selectedCategory);
//     }, [selectedCategory]);

//     useEffect(() => {
//         // Filter items when search query changes
//         if (searchQuery.trim() === '') {
//             setFilteredItems(itemList);
//         } else {
//             const filtered = itemList.filter(item =>
//                 item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 item.description.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//             setFilteredItems(filtered);
//         }
//     }, [searchQuery, itemList]);

//     const GetItemList = async (category) => {
//         try {
//             setLoader(true);
//             setItemList([]);
//             const q = query(collection(db, 'Items'), where('category', '==', category));
//             const querySnapshot = await getDocs(q);

//             const items = [];
//             querySnapshot.forEach(doc => {
//                 items.push({ id: doc.id, ...doc.data() });
//             });
//             setItemList(items);
//             setFilteredItems(items);
//         } catch (error) {
//             console.error("Error fetching items: ", error);
//         } finally {
//             setLoader(false);
//         }
//     }

//     const handleRefresh = () => {
//         GetItemList(selectedCategory);
//     }

//     return (
//         <View style={{ flex: 1 }}>
//             <Category 
//                 category={(value) => {
//                     setSelectedCategory(value);
//                     setSearchQuery(''); // Reset search when category changes
//                 }} 
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//             />
            
//             {loader ? (
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <ActivityIndicator size="large" color={Colors.PRIMARY} />
//                 </View>
//             ) : filteredItems.length === 0 ? (
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>
//                         {searchQuery ? 'No items match your search' : 'No items found in this category'}
//                     </Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={filteredItems}
//                     numColumns={2}
//                     keyExtractor={(item) => item.id}
//                     refreshing={loader}
//                     onRefresh={handleRefresh}
//                     contentContainerStyle={{ paddingBottom: 20 }}
//                     renderItem={({ item }) => (
//                         <ItemList itm={item} />
//                     )}
//                 />
//             )}
//         </View>
//     );
// }