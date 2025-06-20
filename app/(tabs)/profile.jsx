import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import { useState } from 'react';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const phoneNumber = user?.unsafeMetadata?.phoneNumber;
  const avatarUrl = user?.unsafeMetadata?.avatarUrl;
  const imageUrl = user?.imageUrl;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace('/signIn');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  const menuItems = [
    {
      icon: <MaterialIcons name="favorite" size={24} color="#FF6B6B" />,
      label: 'Favorites',
      onPress: () => router.push('/favorite'),
    },
    {
      icon: <MaterialIcons name="shopping-cart" size={24} color="#4ECDC4" />,
      label: 'My Cart',
      onPress: () => router.push('/cart'),
    },
    {
      icon: <Ionicons name="chatbubble-ellipses" size={24} color="#FFD166" />,
      label: 'Messages',
      onPress: () => router.push('/inbox'),
    },
    {
      icon: <Feather name="help-circle" size={24} color="#7C3AED" />,
      label: 'Help Center',
      onPress: () => router.push('/help'),
    },
    {
      icon: <Ionicons name="document-text" size={24} color="#10B981" />,
      label: 'My Orders',
      onPress: () => router.push('/TrackOrders'),
    },
    {
      icon: <Ionicons name="settings" size={24} color="brown" />,
      label: 'Settings',
      onPress: () => router.push('/settings'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ImageBackground
        source={require('../../assets/images/bac.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: imageUrl || user?.imageUrl }}
                style={styles.profileImage}
              />
              <View style={styles.profileTextContainer}>
                <Text style={styles.usernameText}>
                  {user?.firstName} {user?.username}
                </Text>
                {phoneNumber && (
                  <Text style={styles.phoneText}>
                    <Ionicons name="call" size={16} color="#64748B" /> {phoneNumber}
                  </Text>
                )}
                <Text style={styles.emailText}>{user?.primaryEmailAddress?.emailAddress}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => router.push('/edit')}
              activeOpacity={0.7}
            >
              <Feather name="edit" size={22} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.icon.props.color}20` },
                ]}
              >
                {item.icon}
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
          activeOpacity={0.8}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  profileTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  editIcon: {
    padding: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginLeft: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 16,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});