import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';
import MarkFav from '../MarkFav';
import { UserProfile } from '@clerk/clerk-expo/web';
import { useRouter } from 'expo-router';

export default function ItemInfo({ itm }) {
  const router=useRouter();
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this adorable jewellery: ${itm.name}\n\n${itm.imageUrl}`,
        title: `Share ${itm.name}'s profile`,
        url: itm.imageUrl // Some platforms may use this
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
          console.log('Shared with', result.activityType);
        } else {
          // Shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share pet information');
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: itm.imageUrl }} 
        style={styles.petImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.petName}>
            {itm?.name}
          </Text>
                   <TouchableOpacity
                    // style={{marginLeft:230,marginBottom:3,display:'flex',flexDirection:'row'}}
                    style={styles.addressContainer}
                    onPress={() => router.push('/cart')}
                  >
                    <Ionicons name="cart-outline" size={35} color="blue" />
                  </TouchableOpacity>
          {/* <View style={styles.addressContainer}>
            <Ionicons name="location" size={16} color={Colors.GRAY} />
            <Text style={styles.petAddress}>
              {itm?.address}
            </Text>
          </View> */}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <MarkFav itm={itm} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  petImage: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  petName: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    marginBottom: 4,
    color: Colors.DARK,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  petAddress: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GRAY,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shareButton: {
    padding: 8,
  }
});