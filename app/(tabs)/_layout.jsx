import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TabLayout = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
        screenListeners={({ route }) => ({
          tabPress: () => {
            const index = ['home', 'explore', 'favorite', 'inbox', 'profile'].indexOf(route.name);
            Animated.spring(tabOffsetValue, {
              toValue: index * 72,
              useNativeDriver: true,
            }).start();
          }
        })}
      >
        <Tabs.Screen 
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused}
                icon={<Ionicons name="home" size={24} />}
                activeColor="#FF6B6B"
                inactiveColor="#8E8E93"
                label="Home"
              />
            ),
          }}
        />
        
        <Tabs.Screen 
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused}
                icon={<Ionicons name="search" size={24} />}
                activeColor="#4ECDC4"
                inactiveColor="#8E8E93"
                label="Explore"
              />
            ),
          }}
        />
        
        <Tabs.Screen 
          name="favorite"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused}
                icon={<MaterialIcons name="favorite" size={24} />}
                activeColor="red"
                inactiveColor="#8E8E93"
                label="Favorites"
              />
            ),
          }}
        />
        
        <Tabs.Screen 
          name="inbox"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused}
                icon={<MaterialIcons name="messenger" size={24} />}
                activeColor="#7FB685"
                inactiveColor="#8E8E93"
                label="Inbox"
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                focused={focused}
                icon={<Ionicons name="person" size={24} />}
                activeColor="#6A8EAE"
                inactiveColor="#8E8E93"
                label="Profile"
              />
            ),
          }}
        />
      </Tabs>
      
      {/* Animated indicator */}
      <Animated.View style={[
        styles.indicator,
        {
          transform: [{ translateX: tabOffsetValue }],
          backgroundColor: '#FF6B6B', // Default color, changes dynamically
        }
      ]}>
        <LinearGradient
          colors={['#FF6B6B', '#4ECDC4', '#FFE66D', '#7FB685', '#6A8EAE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const TabIcon = ({ focused, icon, activeColor, inactiveColor, label }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View style={[
        styles.iconWrapper,
        { 
          transform: [{ scale: scaleValue }],
        }
      ]}>
        {React.cloneElement(icon, {
          color: focused ? activeColor : inactiveColor,
        })}
      </Animated.View>
      <Text style={[
        styles.label,
        { 
          color: focused ? activeColor : 'transparent',
          textShadowColor: focused ? `${activeColor}80` : 'transparent',
        }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 95,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabIconContainer: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // indicator: {
  //   position: 'absolute',
  //   bottom: 78,
  //   left: 42,
  //   width: 30,
  //   height: 4,
  //   borderRadius: 2,
  //   zIndex: 1,
  //   overflow: 'hidden',
  // },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default TabLayout;