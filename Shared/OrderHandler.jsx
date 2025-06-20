

























import { addDoc, collection, doc, updateDoc, Timestamp, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../Config/Firebaseonfig';

/**
 * Generates a unique 8-digit order ID
 */
const generateOrderId = () => {
  // Generate random 8-digit number between 10000000 and 99999999
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const CreateOrder = async (user, cartItems, totalAmount, deliveryAddress, postalCode, paymentMethod = 'COD') => {
  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    const phoneNumber = user?.unsafeMetadata?.phoneNumber || ''; // Made phone number optional
    
    // Enhanced validation with specific error messages
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!cartItems || cartItems.length === 0) missingFields.push('cart items');
    if (!deliveryAddress) missingFields.push('delivery address');
    if (!postalCode) missingFields.push('postal code');
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.error("Order creation failed -", errorMessage);
      throw new Error(errorMessage);
    }

    const orderId = generateOrderId();

    const orderItems = cartItems.map(item => ({
      item_id: item.id || '',
      name: item.name || '',
      price: item.price || 0,
      quantity: item.quantity || 1,
      totalPrice: item.totalPrice || (item.price || 0) * (item.quantity || 1),
      imageUrl: item.imageUrl || '',
      metalWeight: item.metalWeight || 0,
      timestamp: Timestamp.now()
    }));

    const orderData = {
      orderId,
      userEmail: email,
      userPhonenumber: phoneNumber, // Will be empty string if not provided
      userId: user.id,
      items: orderItems,
      totalAmount: totalAmount || 0,
      deliveryAddress: deliveryAddress || '',
      postalCode: postalCode || '',
      createdAt: Timestamp.now(),
      status: 'Pending',
      paymentMethod: paymentMethod,
      isDelivered: false,
      isCancelled: false,
      statusHistory: [{
        status: 'Pending',
        timestamp: Timestamp.now(),
        updatedBy: 'customer'
      }]
    };

    // Use setDoc with the specific document ID (orderId) instead of addDoc
    await setDoc(doc(db, 'UserOrders', orderId), orderData);
    console.log("Order created with ID:", orderId);
    return { docId: orderId, orderId };
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw new Error("Failed to create order: " + error.message);
  }
};

export const updateOrderStatus = async (orderId, newStatus, updatedBy = 'admin') => {
  try {
    const orderRef = doc(db, 'UserOrders', orderId);
    const updateData = {
      status: newStatus,
      ...(newStatus === 'Delivered' && { isDelivered: true, deliveredAt: Timestamp.now() }),
      ...(newStatus === 'Cancelled' && { isCancelled: true, cancelledAt: Timestamp.now() }),
    };

    // Add to status history
    updateData.statusHistory = {
      status: newStatus,
      timestamp: Timestamp.now(),
      updatedBy: updatedBy
    };

    await updateDoc(orderRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId, userId) => {
  try {
    const orderRef = doc(db, 'UserOrders', orderId);
    const updateData = {
      status: 'Cancelled',
      isCancelled: true,
      cancelledAt: Timestamp.now(),
      cancelledBy: userId,
      statusHistory: {
        status: 'Cancelled',
        timestamp: Timestamp.now(),
        updatedBy: 'customer'
      }
    };

    await updateDoc(orderRef, updateData);
    return true;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const markAsReceived = async (orderId, userId) => {
  try {
    const orderRef = doc(db, 'UserOrders', orderId);
    const updateData = {
      status: 'Completed',
      isDelivered: true,
      isCompleted: true,
      completedAt: Timestamp.now(),
      statusHistory: {
        status: 'Completed',
        timestamp: Timestamp.now(),
        updatedBy: 'customer'
      }
    };

    await updateDoc(orderRef, updateData);
    return true;
  } catch (error) {
    console.error("Error marking order as received:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'UserOrders', orderId));
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export default {
  CreateOrder,
  updateOrderStatus,
  cancelOrder,
  markAsReceived,
  deleteOrder
};