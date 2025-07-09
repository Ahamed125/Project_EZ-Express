










// //ai


// import { useUser } from '@clerk/clerk-expo';
// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import UserItem from '../../components/Inbox';
// import { db } from '../../Config/Firebaseonfig';

// export default function Inbox() {
//   const { user } = useUser();
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     if (user) {
//       const unsubscribe = setupChatListener();
//       return () => unsubscribe();
//     }
//   }, [user]);

//   const setupChatListener = () => {
//     const q = query(
//       collection(db, 'Chat'),
//       where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress)
//     );

//     return onSnapshot(
//       q,
//       (querySnapshot) => {
//         const chats = [];
//         querySnapshot.forEach((doc) => {
//           chats.push({
//             id: doc.id,
//             ...doc.data(),
//           });
//         });
//         setUserList(chats);
//         setLoading(false);
//         setRefreshing(false);
//       },
//       (error) => {
//         console.error('Error fetching chats:', error);
//         setLoading(false);
//         setRefreshing(false);
//       }
//     );
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setupChatListener();
//   };

//   const getOtherUserList = () => {
//     const others = userList.map((record) => {
//       const otherUser = record.users?.find(
//         (u) => u?.email !== user?.primaryEmailAddress?.emailAddress
//       );
//       return {
//         docId: record.id,
//         ...otherUser,
//       };
//     }).filter((user) => user?.email);

//     if (searchQuery.trim()) {
//       const lower = searchQuery.toLowerCase();
//       return others.filter(
//         (u) =>
//           u?.email?.toLowerCase().includes(lower) ||
//           u?.name?.toLowerCase().includes(lower)
//       );
//     }

//     return others;
//   };

//   if (loading) {
//     return (
//       <ImageBackground
//         source={require('../../assets/images/background.jpg')}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require('../../assets/images/background.jpg')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <Text style={styles.header}>Inbox</Text>

//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#666"
//         />

//         {getOtherUserList().length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No conversations found</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={getOtherUserList()}
//             keyExtractor={(item) => item.docId}
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             contentContainerStyle={styles.listContainer}
//             renderItem={({ item }) => <UserItem userInfo={item} />}
//           />
//         )}
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'rgba(255,255,255,0.85)',
//   },
//   header: {
//     fontFamily: 'outfit-medium',
//     fontSize: 30,
//     marginBottom: 10,
//     color: '#222',
//   },
//   searchInput: {
//     height: 40,
//     backgroundColor: '#fff',
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     color: '#000',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//   },
// });




























// Inbox.js
import { useUser } from '@clerk/clerk-expo';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import UserItem from '../../components/Inbox';
import { db } from '../../Config/Firebaseonfig';

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      const unsubscribe = setupChatListener();
      return () => unsubscribe();
    }
  }, [user]);

  const setupChatListener = () => {
    const q = query(
      collection(db, 'Chat'),
      where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const chats = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          chats.push({
            id: doc.id,
            ...data,
            // Add last message timestamp for sorting
            lastMessageTime: data.lastMessage?.createdAt?.toDate() || new Date(0),
          });
        });
        
        // Sort chats by last message time (newest first)
        chats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        
        setUserList(chats);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching chats:', error);
        setLoading(false);
        setRefreshing(false);
      }
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setupChatListener();
  };

  const getOtherUserList = () => {
    const others = userList.map((record) => {
      const otherUser = record.users?.find(
        (u) => u?.email !== user?.primaryEmailAddress?.emailAddress
      );
      
      // Calculate unread count for this chat
      const unreadCount = record.lastMessage?.senderEmail !== user?.primaryEmailAddress?.emailAddress 
        && record.lastMessage?.status !== 'read'
        ? 1 : 0;

      return {
        docId: record.id,
        ...otherUser,
        lastMessage: record.lastMessage?.text || '',
        unreadCount,
        lastMessageTime: record.lastMessageTime,
      };
    }).filter((user) => user?.email);

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      return others.filter(
        (u) =>
          u?.email?.toLowerCase().includes(lower) ||
          u?.name?.toLowerCase().includes(lower)
      );
    }

    return others;
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Inbox</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />

        {getOtherUserList().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        ) : (
          <FlatList
            data={getOtherUserList()}
            keyExtractor={(item) => item.docId}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => <UserItem userInfo={item} />}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  header: {
    fontFamily: 'outfit-medium',
    fontSize: 30,
    marginBottom: 10,
    color: '#222',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});