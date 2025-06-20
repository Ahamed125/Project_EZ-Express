





























import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

const OrderItem = ({ order }) => {
  const router = useRouter();
  const date = order?.createdAt?.toDate()?.toLocaleDateString() || 'N/A';
  const time = order?.createdAt?.toDate()?.toLocaleTimeString() || 'N/A';

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
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push({
        pathname: '/OrderDetails',
        params: { orderId: order.id }
      })}
    >
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.orderId || order.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <Text style={styles.dateTime}>{date} at {time}</Text>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Delivery Address:</Text>
        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
          {order.deliveryAddress}
        </Text>
        <Text style={styles.postalCode}>Postal Code: {order.postalCode}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.itemsCount}>{order.items.length} items</Text>
        <Text style={styles.totalAmount}>RS {order.totalAmount.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'outfit-bold',
    fontSize: 12,
    color: Colors.WHITE,
  },
  dateTime: {
    fontFamily: 'outfit-regular',
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.DARK,
  },
  postalCode: {
    fontFamily: 'outfit-regular',
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
    paddingTop: 12,
  },
  itemsCount: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.DARK,
  },
  totalAmount: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.PRIMARY,
  },
});

export default OrderItem;