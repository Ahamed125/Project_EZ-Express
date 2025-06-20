import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ For cart icon

import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../Config/Firebaseonfig';
import AboutItem from '../../components/ItemDetails/AboutItem';
import ItemInfo from '../../components/ItemDetails/ItemInfo';
import ItemSubInfo from '../../components/ItemDetails/ItemSubInfo';
import OwnerInfo from '../../components/ItemDetails/OwnerInfo';
import Colors from '../../constant/Colors';
import MarkCart from '../../components/MarkCart';

export default function ItemDetails() {
  const itm = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();

  const phoneNumber = '+94786146865'; // Phone number for call button

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const InitiateChat = async () => {
    const docId1 = `${user?.primaryEmailAddress?.emailAddress}_${itm?.email}`;
    const docId2 = `${itm?.email}_${user?.primaryEmailAddress?.emailAddress}`;

    const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const existingChat = querySnapshot.docs[0];
      router.push({ pathname: '/chat', params: { id: existingChat.id } });
      return;
    }

    await setDoc(doc(db, 'Chat', docId1), {
      id: docId1,
      users: [
        {
          email: user?.primaryEmailAddress?.emailAddress,
          imageUrl: user?.imageUrl,
          name: user?.fullName || user?.username,
        },
        {
          email: itm?.email,
          imageUrl: itm?.userImage,
          name: itm?.username,
        }
      ],
      userIds: [user?.primaryEmailAddress?.emailAddress, itm?.email]
    });

    router.push({ pathname: '/chat', params: { id: docId1 } });
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}
>
        <ItemInfo itm={itm} />

        <View style={styles.cardWrapper}>
          <MarkCart itm={itm} />
        </View>

        <ItemSubInfo itm={itm} />
        <AboutItem itm={itm} />
        <OwnerInfo itm={itm} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            onPress={handleCall} 
            style={[styles.actionButton, styles.callButton]}
          >
            <Ionicons name="call-outline" size={24} color="white" />
            <Text style={styles.btnText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={InitiateChat} 
            style={[styles.actionButton, styles.chatButton]}
          >
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <Text style={styles.btnText}>Contact Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  callButton: {
    backgroundColor: '#4CAF50', // Green color for call button
  },
  chatButton: {
    backgroundColor: Colors.PRIMARY, // Your existing primary color
  },
  btnText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});