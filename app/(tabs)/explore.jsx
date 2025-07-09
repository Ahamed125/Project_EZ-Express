import { useUser } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MarkCart from '../../components/MarkCart';
import MarkFav from '../../components/MarkFav';
import { db } from '../../Config/Firebaseonfig';
import Colors from '../../constant/Colors';

export default function Explore() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [loader, setLoader] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    fetchItems();
    setupCartListener();
  }, []);

  // Real-time cart listener
  const setupCartListener = () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const email = user.primaryEmailAddress.emailAddress;
    const docRef = doc(db, 'UserCartItem', email);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data();
      const count = data?.cart ? Object.keys(data.cart).length : 0;
      setCartItemCount(count);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const fetchItems = async () => {
    setLoader(true);
    try {
      const q = query(collection(db, 'Items'));
      const querySnapshot = await getDocs(q);
      const itemList = [];
      const categorySet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        itemList.push({ id: doc.id, ...data });
        if (data.category) categorySet.add(data.category);
      });

      setCategories(['All', ...Array.from(categorySet)]);
      setItems(itemList);
      setFilteredItems(itemList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoader(false);
  };

  const applyFilters = (queryText, category) => {
    let filtered = items;

    if (queryText.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(queryText.toLowerCase())
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category === category);
    }

    setFilteredItems(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
    setShowCategoryOptions(false);
  };

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      }
    })
  ).current;

  const renderItem = ({ item }) => (
    <ImageBackground
      source={require('../../assets/images/background.jpg')} 
      style={styles.cardWrapper}
      imageStyle={{ borderRadius: 16 }}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/item-details',
            params: {
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              description: item.description,
              imageUrl: item.imageUrl,
              email: item.email,
              userImage: item.userImage,
              username: item.username,
            },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.nameFavRow}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <MarkFav itm={item} />
          </View>
          <Text style={styles.itemPrice}>RS: {item.price}</Text>
          <MarkCart itm={item} />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>✨ Explore</Text>

      {/* Search + Filter Icon */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search for rings, necklaces..."
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={() => setShowCategoryOptions(!showCategoryOptions)} style={styles.filterIcon}>
          <Ionicons name="filter" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Category Filter Options */}
      {showCategoryOptions && (
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryOption,
                selectedCategory === cat && styles.categoryOptionSelected
              ]}
              onPress={() => handleCategorySelect(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Draggable Cart Icon with Count Badge */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.cartButton]}
      >
        <Pressable onPress={() => router.push('/cart')} style={styles.cartPressable}>
          <MaterialCommunityIcons name="cart" size={28} color="white" />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Products Grid */}
      {loader ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          refreshing={loader}
          onRefresh={fetchItems}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items found 😔</Text>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#F0F4F7',
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-medium',
    color: '#222',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffee',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#333',
  },
  filterIcon: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 1,
  },
  categoryOption: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.PRIMARY,
  },
  categoryText: {
    fontSize: 13,
    color: '#334155',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  grid: {
    paddingBottom: 100,
  },
  nameFavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: 1,
  },
  cardWrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#222',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.PRIMARY,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  cartButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: Colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 100,
  },
  cartPressable: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: Colors.RED,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});