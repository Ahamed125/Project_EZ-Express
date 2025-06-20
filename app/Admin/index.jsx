

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../Config/Firebaseonfig';
import Colors from '../../constant/Colors';
import OrderHandler from '../../Shared/OrderHandler';
import { Alert } from 'react-native';

const statusOptions = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let q;
      
      if (statusFilter === 'All') {
        q = query(collection(db, 'UserOrders'), orderBy('createdAt', 'desc'));
      } else {
        q = query(
          collection(db, 'UserOrders'), 
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
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !selectedStatus) return;

    try {
      setUpdatingStatus(true);
      await OrderHandler.updateOrderStatus(selectedOrder.id, selectedStatus, 'admin');
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, status: selectedStatus } : order
      ));
      
      setModalVisible(false);
      Alert.alert('Success', 'Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await OrderHandler.deleteOrder(orderId);
              setOrders(orders.filter(order => order.id !== orderId));
              Alert.alert('Success', 'Order deleted successfully');
            } catch (error) {
              console.error('Error deleting order:', error);
              Alert.alert('Error', 'Failed to delete order');
            }
          },
        },
      ]
    );
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management</Text>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Order ID or Email"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.statusFilterContainer}>
          <Text style={styles.filterLabel}>Filter by Status:</Text>
          <View style={styles.statusFilterButtons}>
            <TouchableOpacity
              style={[styles.statusFilterButton, statusFilter === 'All' && styles.activeFilter]}
              onPress={() => setStatusFilter('All')}
            >
              <Text style={[styles.statusFilterText, statusFilter === 'All' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            
            {statusOptions.map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.statusFilterButton, statusFilter === status && styles.activeFilter]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[styles.statusFilterText, statusFilter === status && styles.activeFilterText]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item.orderId || item.id.substring(0, 8)}</Text>
              <Text style={[styles.orderStatus, { 
                color: item.status === 'Pending' ? Colors.ORANGE : 
                      item.status === 'Cancelled' ? Colors.RED : 
                      item.status === 'Delivered' || item.status === 'Completed' ? Colors.GREEN : 
                      Colors.BLUE 
              }]}>
                {item.status}
              </Text>
            </View>
            
            <Text style={styles.orderEmail}>{item.userEmail}</Text>
            <Text style={styles.orderDate}>
              {item.createdAt?.toDate()?.toLocaleDateString()} at {item.createdAt?.toDate()?.toLocaleTimeString()}
            </Text>
            
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>RS {item.totalAmount.toLocaleString()}</Text>
              
              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.updateButton]}
                  onPress={() => {
                    setSelectedOrder(item);
                    setSelectedStatus(item.status);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.actionButtonText}>Update</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteOrder(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Status Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            
            <Text style={styles.orderInfo}>Order #{selectedOrder?.orderId || selectedOrder?.id?.substring(0, 8)}</Text>
            <Text style={styles.orderInfo}>Current Status: {selectedOrder?.status}</Text>
            
            <View style={styles.statusOptions}>
              {statusOptions.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, selectedStatus === status && styles.selectedStatus]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[styles.statusOptionText, selectedStatus === status && styles.selectedStatusText]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color={Colors.GRAY}
              />
              <Button
                title={updatingStatus ? "Updating..." : "Update Status"}
                onPress={handleStatusChange}
                color={Colors.PRIMARY}
                disabled={!selectedStatus || updatingStatus}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  searchInput: {
    backgroundColor: Colors.WHITE,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: 'outfit-regular',
  },
  statusFilterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 8,
  },
  statusFilterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  activeFilter: {
    backgroundColor: Colors.PRIMARY,
  },
  statusFilterText: {
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
  },
  orderItem: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.DARK,
  },
  orderStatus: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
  },
  orderEmail: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 5,
  },
  orderDate: {
    fontFamily: 'outfit-regular',
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 10,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  orderTotal: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: Colors.BLUE,
  },
  deleteButton: {
    backgroundColor: Colors.RED,
  },
  actionButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.DARK,
    marginBottom: 15,
    textAlign: 'center',
  },
  orderInfo: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
    marginBottom: 5,
  },
  statusOptions: {
    marginVertical: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  selectedStatus: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  statusOptionText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  selectedStatusText: {
    color: Colors.PRIMARY,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});


