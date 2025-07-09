import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Image, Share, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import Colors from '../../constant/Colors';
import MarkFav from '../MarkFav';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ItemInfo({ itm }) {
  const router = useRouter();
  const [previewVisible, setPreviewVisible] = useState(false);

  const shareImage = async () => {
    try {
      const fileUri = FileSystem.cacheDirectory + 'shared-image.jpg';
      
      // Download the image first
      const { uri } = await FileSystem.downloadAsync(
        itm.imageUrl,
        fileUri
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Share ${itm.name}`,
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg',
        });
      } else {
        Alert.alert('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'An error occurred while sharing the image.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setPreviewVisible(true)}>
        <Image 
          source={{ uri: itm.imageUrl }} 
          style={styles.petImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable 
            style={styles.modalBackground} 
            onPress={() => setPreviewVisible(false)}
          />
          <Image 
            source={{ uri: itm.imageUrl }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close" size={30} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.petName}>
            {itm?.name}
          </Text>
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="cart-outline" size={35} color="blue" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={shareImage} style={styles.shareButton}>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  }
});