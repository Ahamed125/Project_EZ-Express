import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/Firebaseonfig';

const { width: screenWidth } = Dimensions.get('window');

export default function LandingPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const solutionsRef = collection(db, 'solutions');
        const querySnapshot = await getDocs(solutionsRef);
        
        const solutionsData = [];
        querySnapshot.forEach((doc) => {
          solutionsData.push({ 
            id: doc.id, 
            title: doc.data().title ,
            description: doc.data().description ,
            imageUrl: doc.data().imageUrl 
          });
        });
        
        setSolutions(solutionsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching solutions: ", err);
        setError('Failed to load solutions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();

    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (solutions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === solutions.length - 1 ? 0 : prevIndex + 1
        );
        flatListRef.current?.scrollToIndex({
          index: currentIndex === solutions.length - 1 ? 0 : currentIndex + 1,
          animated: true
        });
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [solutions.length, currentIndex]);

  const renderSolutionItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.solutionItem, { 
        transform: [{ scale }],
        opacity
      }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.solutionImage}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#6C63FF', '#4A42E8', '#3A31D8']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
          <Image
            source={require('../assets/images/landing.jpg')}
            style={styles.logo}
          />
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.carouselContainer}>
            <Text style={styles.solutionsHeader}>EZ-EXPRESS</Text>
            {solutions.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={solutions}
                renderItem={renderSolutionItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth
                  );
                  setCurrentIndex(newIndex);
                }}
                contentContainerStyle={styles.solutionsList}
                getItemLayout={(data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
              />
            ) : (
              <Text style={styles.emptyText}>No solutions available at the moment</Text>
            )}
            
            {/* Indicator dots */}
            <View style={styles.indicatorContainer}>
              {solutions.map((_, index) => (
                <View 
                  key={index}
                  style={[
                    styles.indicatorDot,
                    index === currentIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideUpAnim }] }]}>
          <Link href="/signIn" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '90%',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  carouselContainer: {
    width: screenWidth,
    alignItems: 'center',
    marginBottom: 20,
  },
  solutionsList: {
    alignItems: 'center',
  },
  solutionItem: {
    width: screenWidth - 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  solutionImage: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'outfit-bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#6C63FF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  solutionsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'outfit-bold',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginTop: 20,
    padding: 20,
  },
  loader: {
    marginVertical: 30,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 12,
  },
});