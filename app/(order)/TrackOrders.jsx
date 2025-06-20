


import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'expo-router';

import { db } from '../../Config/Firebaseonfig';
import Colors from '../../constant/Colors';
import OrderItem from './OrderItem';

const statusFilters = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

export default function TrackOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;

      if (!email) return;

      let q;
      if (statusFilter === 'All') {
        q = query(
          collection(db, 'UserOrders'), 
          where('userEmail', '==', email),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'UserOrders'), 
          where('userEmail', '==', email),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}></Text> */}

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <View style={styles.filterButtons}>
          {statusFilters.map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, statusFilter === status && styles.activeFilter]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.filterText, statusFilter === status && styles.activeFilterText]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderItem order={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    marginVertical: 20,
    color: Colors.DARK,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  activeFilter: {
    backgroundColor: Colors.PRIMARY,
  },
  filterText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  activeFilterText: {
    color: Colors.WHITE,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  shopNowText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.WHITE,
  },
});