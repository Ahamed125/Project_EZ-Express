
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  View, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { db } from '../../Config/Firebaseonfig';
import Share from '../../Shared/Share';
import ItemList from '../../components/Home/ItemList';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const isTablet = width >= 600; // Tablet detection

export default function Favorite() {
  const { user } = useUser();
  const [favItemList, setFavItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      setRefreshing(true);
      const result = await Share.GetFavList(user);
      const favIds = result?.favorites || [];
      
      if (favIds.length === 0) {
        setFavItemList([]);
        return;
      }

      const q = query(collection(db, 'Items'), where('id', 'in', favIds));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      
      setFavItemList(items);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) loadFavorites();
  }, [user]);

  // Calculate responsive values
  const responsiveFontSize = isTablet ? 36 : 32;
  const responsivePadding = isTablet ? 30 : 20;
  const itemWidth = isTablet ? width * 0.45 : width * 0.48;
  const itemMarginBottom = isTablet ? 20 : 15;
  const iconSize = isTablet ? 30 : 24;

  return (
    <ImageBackground 
      source={require('../../assets/images/bac.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.header, { paddingTop: responsivePadding / 2 }]}>
        <Text style={[styles.title, { fontSize: responsiveFontSize }]}>Your Favorites</Text>
        <TouchableOpacity 
          onPress={loadFavorites} 
          style={styles.refreshButton}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={iconSize} 
            color={refreshing ? Colors.GRAY : Colors.PRIMARY} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={favItemList}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            onRefresh={loadFavorites}
            refreshing={refreshing}
            numColumns={isTablet ? 3 : 2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={[styles.itemContainer, { 
                width: itemWidth,
                marginBottom: itemMarginBottom 
              }]}>
                <ItemList itm={item} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons 
                  name="heart-outline" 
                  size={isTablet ? 80 : 60} 
                  color={Colors.GRAY} 
                />
                <Text style={[styles.emptyTitle, { 
                  fontSize: isTablet ? 26 : 22 
                }]}>
                  No favorites yet
                </Text>
                <Text style={[styles.emptySubtitle, { 
                  fontSize: isTablet ? 16 : 14,
                  maxWidth: isTablet ? '60%' : '80%'
                }]}>
                  Tap the heart icon on items to add them here
                </Text>
              </View>
            }
          />
        </ScrollView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.select({
      tablet: 30,
      default: 20
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({
      tablet: 30,
      default: 25
    }),
  },
  title: {
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
  },
  refreshButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: Platform.select({
      tablet: 12,
      default: 8
    }),
    borderRadius: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Platform.select({
      tablet: 20,
      default: 15
    }),
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  itemContainer: {
    // Dimensions set dynamically in the component
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.select({
      tablet: 150,
      default: 100
    }),
  },
  emptyTitle: {
    fontFamily: 'outfit-medium',
    color: Colors.DARK,
    marginTop: Platform.select({
      tablet: 20,
      default: 15
    }),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginTop: Platform.select({
      tablet: 12,
      default: 8
    }),
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'outfit-medium',
    fontSize: Platform.select({
      tablet: 20,
      default: 16
    }),
    color: Colors.DARK,
    marginTop: 15,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.select({
      tablet: 40,
      default: 20
    }),
  },
});