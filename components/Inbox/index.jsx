import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';
import { useUser } from '@clerk/clerk-expo';

export default function UserItem({ userInfo }) {
  // Fallback image source if user image is not available
   const { user } = useUser();
  
  const avatarUrl = user?.unsafeMetadata?.avatarUrl
  // const imageUrl = user?.imageUrl
  const imageSource = userInfo?.imageUrl 
    ? { uri: userInfo.imageUrl }
    : require('../../assets/images/default-avatar.jpeg');

  return (
    <Link 
      href={`/chat?id=${userInfo?.docId}`} 
      asChild
      style={styles.linkContainer}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image 
              source={imageSource }
              
              // source={{ uri: imageUrl || user?.imageUrl }}
              style={styles.image}
              onError={() => console.log("Error loading image")}
              resizeMode="cover"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {userInfo?.name||userInfo?.username || 'Unknown User'}
            </Text>
            {userInfo?.lastMessage && (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {userInfo.lastMessage}
              </Text>
            )}
          </View>

          {userInfo?.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{userInfo.unreadCount}</Text>
            </View>
          )}

          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={Colors.GRAY} 
          />
        </View>
        
        <View style={styles.divider} />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    marginBottom: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.DARK,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    marginLeft: 72, // Align with text
  },
  unreadBadge: {
    backgroundColor: Colors.PRIMARY,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});





