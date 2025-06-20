














// import { useUser } from '@clerk/clerk-expo';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import {
//     addDoc,
//     collection,
//     doc,
//     getDoc,
//     onSnapshot,
//     orderBy,
//     query
// } from 'firebase/firestore';
// import { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native';
// import { Avatar, Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
// import { db } from '../../Config/Firebaseonfig';

// export default function ChatScreen() {
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const flatListRef = useRef(null);
//   const avatarUrl = user?.unsafeMetadata?.avatarUrl;
//   const [otherUser, setOtherUser] = useState(null);
//   const [adminPhoneNumber, setAdminPhoneNumber] = useState('');

//   useEffect(() => {
//     if (!params?.id || !user?.primaryEmailAddress?.emailAddress) return;

//     loadHeader();
//     fetchAdminPhoneNumber();

//     const messagesQuery = query(
//       collection(db, 'Chat', params.id, 'Messages'),
//       orderBy('createdAt', 'asc')
//     );

//     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//       const loaded = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           _id: doc.id,
//           text: data.text || '',
//           createdAt: data.createdAt?.toDate() || new Date(),
//           user: data.user,
//         };
//       });

//       setMessages(loaded);
      
//       if (loaded.length > messages.length) {
//         setTimeout(() => {
//           flatListRef.current?.scrollToEnd({ animated: true });
//         }, 100);
//       }
//     });

//     return () => unsubscribe();
//   }, [params?.id]);

//   const fetchAdminPhoneNumber = async () => {
//     try {
//       const adminDoc = await getDoc(doc(db, 'admincall', 'admin'));
//       if (adminDoc.exists()) {
//         const phone = adminDoc.data().phoneNumber;
//         if (phone) {
//           setAdminPhoneNumber(phone);
//         } else {
//           console.warn('Admin phone number exists but is empty');
//         }
//       } else {
//         console.warn('Admin document not found');
//       }
//     } catch (error) {
//       console.error('Error fetching admin phone number:', error);
//       Alert.alert('Error', 'Could not fetch admin contact details');
//     }
//   };

//   const handleCallPress = async () => {
//     try {
//       if (!adminPhoneNumber) {
//         await fetchAdminPhoneNumber();
//       }
      
//       if (adminPhoneNumber) {
//         const phoneUrl = `tel:${adminPhoneNumber}`;
//         const supported = await Linking.canOpenURL(phoneUrl);
        
//         if (supported) {
//           await Linking.openURL(phoneUrl);
//         } else {
//           Alert.alert('Error', 'Phone calls are not supported on this device');
//         }
//       } else {
//         Alert.alert('Info', 'Admin phone number is not available');
//       }
//     } catch (error) {
//       console.error('Call error:', error);
//       Alert.alert('Error', 'Failed to make the call');
//     }
//   };

//   const loadHeader = async () => {
//     try {
//       const chatDoc = await getDoc(doc(db, 'Chat', params?.id));
//       if (!chatDoc.exists()) return;
      
//       const chatData = chatDoc.data();
//       const foundOtherUser = chatData?.users?.find(
//         (u) => u.email !== user?.primaryEmailAddress?.emailAddress
//       );
      
//       if (foundOtherUser) {
//         setOtherUser(foundOtherUser);
//         navigation.setOptions({
//           headerTitle: () => (
//             <View style={styles.headerContainer}>
//               {foundOtherUser.imageUrl ? (
//                 <Image 
//                   source={{ uri: foundOtherUser.imageUrl }}
//                   style={styles.headerAvatar}
//                 />
//               ) : (
//                 <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
//                   <Text style={styles.headerAvatarText}>
//                     {foundOtherUser.name?.charAt(0) || 'U'}
//                   </Text>
//                 </View>
//               )}
//               <Text style={styles.headerTitle}>{foundOtherUser.name || 'Chat'}</Text>
//             </View>
//           ),
//           headerRight: () => (
//             <View style={styles.headerIconsContainer}>
//               <TouchableOpacity 
//                 style={styles.headerIcon} 
//                 onPress={handleCallPress}
//                 testID="callButton"
//               >
//                 <Ionicons name="call" size={20} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.headerIcon}>
//                 <Ionicons name="ellipsis-vertical" size={20} color="white" />
//               </TouchableOpacity>
//             </View>
//           ),
//           headerStyle: {
//             backgroundColor: '#128C7E',
//           },
//           headerTintColor: 'white',
//         });
//       }
//     } catch (error) {
//       console.error('Header load error:', error);
//     }
//   };

//   const onSend = async (newMessages = []) => {
//     try {
//       const msg = newMessages[0];
//       const messageData = {
//         ...msg,
//         createdAt: new Date(),
//         user: {
//           _id: user?.primaryEmailAddress?.emailAddress,
//           name: user?.username || user?.fullName || 'Me',
//           avatar: avatarUrl || ''
//         }
//       };

//       await addDoc(collection(db, 'Chat', params.id, 'Messages'), messageData);
//     } catch (err) {
//       console.error('Send error:', err);
//       Alert.alert('Error', 'Failed to send message');
//     }
//   };

//   const renderBubble = (props) => (
//     <Bubble
//       {...props}
//       wrapperStyle={{
//         right: {
//           backgroundColor: '#dcf8c6',
//           borderRadius: 12,
//           marginBottom: 5,
//           padding: 6,
//           maxWidth: '80%',
//         },
//         left: {
//           backgroundColor: '#fff',
//           borderRadius: 12,
//           marginBottom: 5,
//           padding: 6,
//           maxWidth: '80%',
//         },
//       }}
//       textStyle={{
//         right: { color: '#000' },
//         left: { color: '#000' },
//       }}
//     />
//   );

//   const renderSend = (props) => (
//     <Send {...props} containerStyle={styles.sendContainer}>
//       <View style={styles.sendButton}>
//         <Ionicons name="send" size={24} color="white" />
//       </View>
//     </Send>
//   );

//   const renderInputToolbar = (props) => (
//     <InputToolbar
//       {...props}
//       containerStyle={styles.inputToolbar}
//       primaryStyle={{ alignItems: 'center' }}
//     />
//   );

//   const renderAvatar = (props) => {
//     if (props.currentMessage.user._id === user?.primaryEmailAddress?.emailAddress) {
//       return null;
//     }
//     return (
//       <Avatar
//         {...props}
//         imageStyle={{
//           left: { width: 36, height: 36, borderRadius: 18 },
//         }}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={onSend}
//         user={{
//           _id: user?.primaryEmailAddress?.emailAddress,
//           name: user?.username || user?.fullName,
//           avatar: avatarUrl,
//         }}
//         renderBubble={renderBubble}
//         renderAvatar={renderAvatar}
//         renderSend={renderSend}
//         renderInputToolbar={renderInputToolbar}
//         alwaysShowSend
//         scrollToBottom
//         alignTop={false}
//         inverted={false}
//         listViewProps={{
//           ref: flatListRef,
//           onContentSizeChange: () => {
//             flatListRef.current?.scrollToEnd({ animated: true });
//           },
//         }}
//         timeTextStyle={{
//           left: { color: 'gray' },
//           right: { color: 'gray' },
//         }}
//         minInputToolbarHeight={60}
//         bottomOffset={10}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e5ddd5',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 10,
//   },
//   headerAvatarPlaceholder: {
//     backgroundColor: '#075E54',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerAvatarText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   headerTitle: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   headerIconsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   headerIcon: {
//     marginLeft: 20,
//   },
//   sendButton: {
//     marginRight: 10,
//     marginBottom: 5,
//     backgroundColor: '#128c7e',
//     borderRadius: 20,
//     padding: 8,
//   },
//   sendContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginRight: 10,
//   },
//   inputToolbar: {
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     margin: 10,
//     marginBottom: 5,
//   },
// });














import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { Avatar, Bubble, GiftedChat, InputToolbar, Send, Time } from 'react-native-gifted-chat';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import { db } from '../../Config/Firebaseonfig';

export default function ChatScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const flatListRef = useRef(null);
  const avatarUrl = user?.unsafeMetadata?.avatarUrl;
  const [otherUser, setOtherUser] = useState(null);
  const [adminPhoneNumber, setAdminPhoneNumber] = useState('');
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);

  useEffect(() => {
    if (!params?.id || !user?.primaryEmailAddress?.emailAddress) return;

    loadHeader();
    fetchAdminPhoneNumber();

    const messagesQuery = query(
      collection(db, 'Chat', params.id, 'Messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const loaded = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          user: data.user,
          status: data.status || 'sent',
          sent: data.sent || true,
          received: data.received || false,
          pending: data.pending || false,
          isDeleted: data.isDeleted || false,
          deletedBy: data.deletedBy || null,
        };
      });

      setMessages(loaded);
      
      if (loaded.length > 0) {
        const lastMessage = loaded[loaded.length - 1];
        if (lastMessage.user._id !== user?.primaryEmailAddress?.emailAddress) {
          await markMessagesAsDelivered(loaded);
        }
      }

      if (loaded.length > messages.length) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return () => unsubscribe();
  }, [params?.id]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.user._id !== user?.primaryEmailAddress?.emailAddress && 
          lastMessage._id !== lastSeenMessageId) {
        markMessagesAsRead(messages);
        setLastSeenMessageId(lastMessage._id);
      }
    }
  }, [messages]);

  const markMessagesAsDelivered = async (messages) => {
    try {
      const myEmail = user?.primaryEmailAddress?.emailAddress;
      const undeliveredMessages = messages.filter(
        msg => msg.user._id !== myEmail && msg.status === 'sent'
      );

      if (undeliveredMessages.length > 0) {
        const batch = [];
        undeliveredMessages.forEach(msg => {
          const messageRef = doc(db, 'Chat', params.id, 'Messages', msg._id);
          batch.push(updateDoc(messageRef, { 
            status: 'delivered',
            received: true 
          }));
        });

        await Promise.all(batch);
      }
    } catch (error) {
      console.error('Error marking messages as delivered:', error);
    }
  };

  const markMessagesAsRead = async (messages) => {
    try {
      const myEmail = user?.primaryEmailAddress?.emailAddress;
      const unreadMessages = messages.filter(
        msg => msg.user._id !== myEmail && msg.status !== 'read'
      );

      if (unreadMessages.length > 0) {
        const batch = [];
        unreadMessages.forEach(msg => {
          const messageRef = doc(db, 'Chat', params.id, 'Messages', msg._id);
          batch.push(updateDoc(messageRef, { 
            status: 'read',
            readAt: serverTimestamp()
          }));
        });

        await Promise.all(batch);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchAdminPhoneNumber = async () => {
    try {
      const adminDoc = await getDoc(doc(db, 'admincall', 'admin'));
      if (adminDoc.exists()) {
        const phone = adminDoc.data().phoneNumber;
        if (phone) {
          setAdminPhoneNumber(phone);
          return phone;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin phone number:', error);
      return null;
    }
  };

  const handleCallPress = async () => {
    try {
      let phoneNumber = adminPhoneNumber;
      
      if (!phoneNumber) {
        phoneNumber = await fetchAdminPhoneNumber();
      }
      
      if (phoneNumber) {
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        Communications.phonecall(cleanedPhoneNumber, true);
      } else {
        Alert.alert('Info', 'Admin phone number is not available');
      }
    } catch (error) {
      console.error('Call error:', error);
      Alert.alert('Error', 'Failed to make the call');
    }
  };

  const loadHeader = async () => {
    try {
      const chatDoc = await getDoc(doc(db, 'Chat', params?.id));
      if (!chatDoc.exists()) return;
      
      const chatData = chatDoc.data();
      const foundOtherUser = chatData?.users?.find(
        (u) => u.email !== user?.primaryEmailAddress?.emailAddress
      );
      
      if (foundOtherUser) {
        setOtherUser(foundOtherUser);
        navigation.setOptions({
          headerTitle: () => (
            <View style={styles.headerContainer}>
              {foundOtherUser.imageUrl ? (
                <Image 
                  source={{ uri: foundOtherUser.imageUrl }}
                  style={styles.headerAvatar}
                />
              ) : (
                <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                  <Text style={styles.headerAvatarText}>
                    {foundOtherUser.name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
              <Text style={styles.headerTitle}>{foundOtherUser.name || 'Chat'}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerIconsContainer}>
              <TouchableOpacity 
                style={styles.headerIcon} 
                onPress={handleCallPress}
                testID="callButton"
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#128C7E',
          },
          headerTintColor: 'white',
        });
      }
    } catch (error) {
      console.error('Header load error:', error);
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const msg = newMessages[0];
      const messageData = {
        ...msg,
        createdAt: new Date(),
        user: {
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.username || user?.fullName || 'Me',
          avatar: avatarUrl || ''
        },
        status: 'sent',
        sent: true,
        received: false,
        pending: false,
        isDeleted: false,
        deletedBy: null
      };

      await addDoc(collection(db, 'Chat', params.id, 'Messages'), messageData);
    } catch (err) {
      console.error('Send error:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, 'Chat', params.id, 'Messages', messageId);
      await updateDoc(messageRef, {
        isDeleted: true,
        deletedBy: user?.primaryEmailAddress?.emailAddress,
        text: 'This message was deleted',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  const handleMessageLongPress = (context, message) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Message'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            deleteMessage(message._id);
          }
        }
      );
    }
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    
    if (currentMessage.isDeleted) {
      return (
        <View style={[
          styles.deletedMessageContainer,
          currentMessage.user._id === user?.primaryEmailAddress?.emailAddress 
            ? styles.deletedMessageRight 
            : styles.deletedMessageLeft
        ]}>
          <Text style={styles.deletedMessageText}>
            {currentMessage.text}
          </Text>
          <Time
            {...props}
            timeTextStyle={{
              left: { color: 'gray' },
              right: { color: 'gray' },
            }}
          />
        </View>
      );
    }

    if (Platform.OS === 'android') {
      return (
        <Menu>
          <MenuTrigger
            customStyles={{
              triggerWrapper: {
                flex: 1,
              }
            }}
            onAlternativeAction={() => handleMessageLongPress(null, currentMessage)}
          >
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#dcf8c6',
                  borderRadius: 12,
                  marginBottom: 5,
                  padding: 6,
                  maxWidth: '80%',
                },
                left: {
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  marginBottom: 5,
                  padding: 6,
                  maxWidth: '80%',
                },
              }}
              textStyle={{
                right: { color: '#000' },
                left: { color: '#000' },
              }}
              renderTime={renderTime}
              onLongPress={() => handleMessageLongPress(null, currentMessage)}
            />
          </MenuTrigger>
          <MenuOptions>
            {currentMessage.user._id === user?.primaryEmailAddress?.emailAddress && (
              <MenuOption onSelect={() => deleteMessage(currentMessage._id)} text="Delete" />
            )}
            <MenuOption onSelect={() => {}} text="Cancel" />
          </MenuOptions>
        </Menu>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#dcf8c6',
            borderRadius: 12,
            marginBottom: 5,
            padding: 6,
            maxWidth: '80%',
          },
          left: {
            backgroundColor: '#fff',
            borderRadius: 12,
            marginBottom: 5,
            padding: 6,
            maxWidth: '80%',
          },
        }}
        textStyle={{
          right: { color: '#000' },
          left: { color: '#000' },
        }}
        renderTime={renderTime}
        onLongPress={() => handleMessageLongPress(null, currentMessage)}
      />
    );
  };

  const renderTime = (props) => {
    const { currentMessage } = props;
    const isMyMessage = currentMessage.user._id === user?.primaryEmailAddress?.emailAddress;
    
    return (
      <View style={[styles.timeContainer, isMyMessage ? styles.myTimeContainer : null]}>
        <Text style={[styles.timeText, isMyMessage ? styles.myTimeText : null]}>
          {new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {isMyMessage && (
          <View style={styles.statusContainer}>
            {currentMessage.status === 'sent' && (
              <Ionicons name="checkmark" size={16} color="gray" style={styles.singleTick} />
            )}
            {currentMessage.status === 'delivered' && (
              <View style={styles.doubleTicks}>
                <Ionicons name="checkmark" size={16} color="gray" style={styles.tick1} />
                <Ionicons name="checkmark" size={16} color="gray" style={styles.tick2} />
              </View>
            )}
            {currentMessage.status === 'read' && (
              <View style={styles.doubleTicks}>
                <Ionicons name="checkmark" size={16} color="#4FC3F7" style={styles.tick1} />
                <Ionicons name="checkmark" size={16} color="#4FC3F7" style={styles.tick2} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderSend = (props) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={24} color="white" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderAvatar = (props) => {
    if (props.currentMessage.user._id === user?.primaryEmailAddress?.emailAddress || 
        props.currentMessage.isDeleted) {
      return null;
    }
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: { width: 36, height: 36, borderRadius: 18 },
        }}
      />
    );
  };

  return (
    <MenuProvider style={styles.container}>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user?.primaryEmailAddress?.emailAddress,
            name: user?.username || user?.fullName,
            avatar: avatarUrl,
          }}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          alwaysShowSend
          scrollToBottom
          alignTop={false}
          inverted={false}
          listViewProps={{
            ref: flatListRef,
            onContentSizeChange: () => {
              flatListRef.current?.scrollToEnd({ animated: true });
            },
          }}
          minInputToolbarHeight={60}
          bottomOffset={10}
        />
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  headerAvatarPlaceholder: {
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerIcon: {
    marginLeft: 20,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#128c7e',
    borderRadius: 20,
    padding: 8,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  myTimeContainer: {
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
  },
  myTimeText: {
    color: 'gray',
  },
  statusContainer: {
    marginLeft: 5,
  },
  singleTick: {
    marginLeft: 2,
  },
  doubleTicks: {
    flexDirection: 'row',
    position: 'relative',
    width: 16,
    height: 16,
  },
  tick1: {
    position: 'absolute',
    left: 0,
  },
  tick2: {
    position: 'absolute',
    left: 4,
  },
  deletedMessageContainer: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 5,
    maxWidth: '80%',
    backgroundColor: '#f5f5f5',
  },
  deletedMessageLeft: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  deletedMessageRight: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  deletedMessageText: {
    color: 'gray',
    fontStyle: 'italic',
  },
});





































