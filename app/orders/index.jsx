






















import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Config/Firebaseonfig';
import Colors from '../../constant/Colors';
import OrderHandler from '../../Shared/OrderHandler';

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const docRef = doc(db, 'UserOrders', orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Order not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to load order details');
      router.back();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      Alert.alert('Error', 'No order ID provided');
      router.back();
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setUpdatingStatus(true);
              await OrderHandler.cancelOrder(orderId, order.userId);
              // Refresh order details
              const docRef = doc(db, 'UserOrders', orderId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() });
              }
              Alert.alert('Success', 'Order has been cancelled');
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order');
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkAsReceived = async () => {
    Alert.alert(
      'Order Received',
      'Have you received this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setUpdatingStatus(true);
              await OrderHandler.markAsReceived(orderId, order.userId);
              // Refresh order details
              const docRef = doc(db, 'UserOrders', orderId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() });
              }
              Alert.alert('Success', 'Order marked as received');
            } catch (error) {
              console.error('Error marking order as received:', error);
              Alert.alert('Error', 'Failed to update order status');
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>RS {item.price.toLocaleString()}</Text>
        </View>
        <Text style={styles.itemTotal}>Total: RS {item.totalPrice.toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load order details</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = order?.createdAt?.toDate()?.toLocaleDateString() || 'N/A';
  const time = order?.createdAt?.toDate()?.toLocaleTimeString() || 'N/A';
  const deliveredDate = order?.deliveredAt?.toDate()?.toLocaleDateString() || 'N/A';
  const deliveredTime = order?.deliveredAt?.toDate()?.toLocaleTimeString() || 'N/A';
  const cancelledDate = order?.cancelledAt?.toDate()?.toLocaleDateString() || 'N/A';
  const cancelledTime = order?.cancelledAt?.toDate()?.toLocaleTimeString() || 'N/A';

  const getStatusColor = () => {
    switch (order.status) {
      case 'Pending':
        return Colors.ORANGE;
      case 'Confirmed':
      case 'Processing':
      case 'Shipped':
        return Colors.BLUE;
      case 'Delivered':
      case 'Completed':
        return Colors.GREEN;
      case 'Cancelled':
        return Colors.RED;
      default:
        return Colors.PRIMARY;
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.PRIMARY]}
          tintColor={Colors.PRIMARY}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.orderId}>Order #{order.orderId || order.id?.substring(0, 8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <Text style={styles.dateTime}>Placed on {date} at {time}</Text>

        {order.status === 'Delivered' && (
          <Text style={styles.dateTime}>Delivered on {deliveredDate} at {deliveredTime}</Text>
        )}

        {order.status === 'Cancelled' && (
          <Text style={styles.dateTime}>Cancelled on {cancelledDate} at {cancelledTime}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.address}>{order.deliveryAddress}</Text>
          <Text style={styles.postalCode}>Postal Code: {order.postalCode}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.paymentMethod}>
            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 
             order.paymentMethod === 'Card' ? 'Credit/Debit Card' : 
             'Bank Transfer'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={order.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.item_id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>RS {order.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee:</Text>
            <Text style={styles.totalValue}>RS 0</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>RS {order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {order.status === 'Pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelOrder}
            disabled={updatingStatus}
          >
            {updatingStatus ? (
              <ActivityIndicator color={Colors.WHITE} />
            ) : (
              <Text style={styles.actionButtonText}>Cancel Order</Text>
            )}
          </TouchableOpacity>
        )}

        {order.status === 'Delivered' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.receivedButton]}
            onPress={handleMarkAsReceived}
            disabled={updatingStatus}
          >
            {updatingStatus ? (
              <ActivityIndicator color={Colors.WHITE} />
            ) : (
              <Text style={styles.actionButtonText}>Mark as Received</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: Colors.RED,
    textAlign: 'center',
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    color: Colors.DARK,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
    color: Colors.WHITE,
  },
  dateTime: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 10,
  },
  address: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.DARK,
    marginBottom: 5,
  },
  postalCode: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
  },
  paymentMethod: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
    gap: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
  },
  itemPrice: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
  },
  itemTotal: {
    fontFamily: 'outfit-bold',
    fontSize: 14,
    color: Colors.DARK,
    marginTop: 4,
  },
  totalContainer: {
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: Colors.DARK,
  },
  totalValue: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: Colors.DARK,
  },
  totalAmount: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.PRIMARY,
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: Colors.RED,
  },
  receivedButton: {
    backgroundColor: Colors.GREEN,
  },
  actionButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.WHITE,
  },
  backButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.WHITE,
  },
});