// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   FlatList,
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView
  
// } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../../Config/Firebaseonfig';
// import CartHandler from '../../Shared/CartHandler';
// import OrderHandler from '../../Shared/OrderHandler';
// import Colors from '../../constant/Colors';
// import { useRouter } from 'expo-router';
// import { ImageBackground } from 'react-native';

// export default function Cart() {
//   const { user } = useUser();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [total, setTotal] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [paymentModalVisible, setPaymentModalVisible] = useState(false);
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [postalCode, setPostalCode] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       fetchCartItems();
//     }
//   }, [user]);

//   const fetchCartItems = async () => {
//     try {
//       setRefreshing(true);
//       const result = await CartHandler.GetCartList(user);
//       await fetchCartDetails(result?.cart || {});
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchCartDetails = async (cart) => {
//     if (!Object.keys(cart)?.length) {
//       setCartItems([]);
//       setTotal(0);
//       return;
//     }

//     try {
//       const ids = Object.keys(cart);
//       const q = query(collection(db, 'Items'), where('id', 'in', ids));
//       const snapshot = await getDocs(q);

//       const items = [];
//       let calculatedTotal = 0;
      
//       snapshot.forEach(doc => {
//         if (doc.exists()) {
//           const itemData = doc.data();
//           const cartItem = cart[itemData.id];
//           const itemTotal = cartItem.quantity * itemData.price;
          
//           items.push({
//             ...itemData,
//             quantity: cartItem.quantity,
//             totalPrice: itemTotal
//           });
          
//           calculatedTotal += itemTotal;
//         }
//       });
      
//       setCartItems(items);
//       setTotal(calculatedTotal);
//     } catch (error) {
//       console.error("Error fetching cart details:", error);
//     }
//   };

//   const updateQuantity = async (itemId, newQuantity) => {
//     if (!user || newQuantity < 1) return;
    
//     try {
//       setRefreshing(true);
//       const cartData = await CartHandler.GetCartList(user);
//       let updatedCart = { ...(cartData.cart || {}) };

//       if (newQuantity > 0) {
//         updatedCart[itemId] = {
//           ...updatedCart[itemId],
//           quantity: newQuantity
//         };
//       } else {
//         delete updatedCart[itemId];
//       }

//       await CartHandler.UpdateCart(user, updatedCart);
//       await fetchCartItems();
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const removeItem = async (itemId) => {
//     try {
//       setRefreshing(true);
//       const cartData = await CartHandler.GetCartList(user);
//       let updatedCart = { ...(cartData.cart || {}) };
      
//       delete updatedCart[itemId];
      
//       await CartHandler.UpdateCart(user, updatedCart);
//       await fetchCartItems();
//     } catch (error) {
//       console.error("Error removing item:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       setRefreshing(true);
//       await CartHandler.UpdateCart(user, {});
//       await fetchCartItems();
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleLocateMe = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = location.coords;

//     let address = await Location.reverseGeocodeAsync({ latitude, longitude });
//     if (address.length > 0) {
//       const { street, city, region, postalCode } = address[0];
//       setDeliveryAddress(`${street}, ${city}, ${region}`);
//       setPostalCode(postalCode);
//     }
//   };

//   const renderAddressModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => setModalVisible(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Enter Delivery Details</Text>
//           <TextInput
//             style={styles.addressInput}
//             placeholder="Enter your address"
//             value={deliveryAddress}
//             onChangeText={setDeliveryAddress}
//           />
//           <TextInput
//             style={styles.addressInput}
//             placeholder="Postal Code"
//             value={postalCode}
//             onChangeText={setPostalCode}
//           />

//           <Button title="Locate Me" onPress={handleLocateMe} color={Colors.PRIMARY} />
  

//           <View style={styles.buttonContainer}>
//             <View style={[styles.buttonWrapper, styles.buttonGap]}>
//               <Button
//                 title="Continue to Payment"
//                 onPress={() => {
//                   if (!deliveryAddress || !postalCode) {
//                     Alert.alert('Error', 'Please enter both delivery address and postal code.');
//                     return;
//                   }
//                   setModalVisible(false);
//                   setPaymentModalVisible(true);
//                 }}
//                 color={Colors.PRIMARY}
//                 disabled={!deliveryAddress || !postalCode}
//               />
//             </View>
//             <View style={[styles.buttonWrapper, styles.buttonGap]}>
//               <Button 
//                 title="Cancel" 
//                 onPress={() => setModalVisible(false)} 
//                 color={Colors.PRIMARY} 
//               />
//             </View>
//           </View>
//         </View>
//       </View>
      
//     </Modal>
//   );

//   const renderPaymentModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={paymentModalVisible}
//       onRequestClose={() => setPaymentModalVisible(false)}

//     >
//                   <ImageBackground
//                 source={require('../../assets/images/bac.jpg')} 
//                 style={styles.container}
//                 resizeMode="cover"
//               >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Select Payment Method</Text>
          
//           <TouchableOpacity 
//             style={[styles.paymentOption, paymentMethod === 'COD' && styles.selectedPayment]}
//             onPress={() => setPaymentMethod('COD')}
//           >
//             <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.paymentOption, paymentMethod === 'Card' && styles.selectedPayment]}
//             onPress={() => setPaymentMethod('Card')}
//           >
//             <Text style={styles.paymentText}>Credit/Debit Card</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.paymentOption, paymentMethod === 'BankTransfer' && styles.selectedPayment]}
//             onPress={() => setPaymentMethod('BankTransfer')}
//           >
//             <Text style={styles.paymentText}>Bank Transfer</Text>
//           </TouchableOpacity>

//           <View style={styles.buttonContainer}>
//             <View style={[styles.buttonWrapper, styles.buttonGap]}>
//               <Button
//                 title="Place Order"
//                 onPress={handleAddressSubmit}
//                 color={Colors.PRIMARY}
//               />
//             </View>
//             <View style={[styles.buttonWrapper, styles.buttonGap]}>
//               <Button 
//                 title="Back" 
//                 onPress={() => {
//                   setPaymentModalVisible(false);
//                   setModalVisible(true);
//                 }} 
//                 color={Colors.PRIMARY} 
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//       </ImageBackground>
//     </Modal>
//   );

//   const handleAddressSubmit = async () => {
//     try {
//       await proceedWithOrder();
//       setPaymentModalVisible(false);
//       setDeliveryAddress('');
//       setPostalCode('');
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       Alert.alert('Error', 'Failed to place order. Please try again.');
//     }
//   };

//   const placeOrder = () => {
//     Alert.alert(
//       'Place Order',
//       'Are you sure you want to place this order?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'OK',
//           onPress: () => setModalVisible(true),
//         },
//       ]
//     );
//   };

//   const proceedWithOrder = async () => {
//     try {
//       if (!user || cartItems.length === 0) return;

//       const orderId = await OrderHandler.CreateOrder(
//         user, 
//         cartItems, 
//         total,
//         deliveryAddress,
//         postalCode,
//         paymentMethod
//       );
      
//       if (orderId) {
//         await clearCart();
//         Alert.alert(
//           'Order Placed', 
//           'Your order has been placed successfully!',
//           [{ 
//             text: 'OK',
//             onPress: () => router.push({
//               pathname: '/OrderDetails',
//               params: { orderId: orderId.docId }
//             })
//           }]
//         );
//       } else {
//         throw new Error("Failed to create order");
//       }
//     } catch (error) {
//       console.error("Checkout error:", error);
//       throw error;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.title}>Cart</Text> */}

//       {cartItems.length > 0 ? (
//         <>
//           <ScrollView 
//             style={styles.scrollContainer}
//             contentContainerStyle={styles.scrollContent}
//               showsVerticalScrollIndicator={false}
//           >
//             <FlatList
//               data={cartItems}
//               scrollEnabled={false}
                                 
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.cartItem}>
//                   <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  
//                   <View style={styles.itemDetails}>
//                     <Text style={styles.itemName}>{item.name}</Text>
//                     <Text style={styles.itemWeight}>{item.metalWeight}</Text>
//                     <Text style={styles.itemPrice}>RS {item.price.toLocaleString()}</Text>
                    
//                     <View style={styles.quantityRow}>
//                       <TouchableOpacity 
//                         onPress={() => updateQuantity(item.id, item.quantity - 1)}
//                         style={styles.quantityButton}
//                         disabled={item.quantity <= 1}
//                       >
//                         <Text style={styles.quantityButtonText}>-</Text>
//                       </TouchableOpacity>
                      
//                       <Text style={styles.quantityText}>{item.quantity}</Text>
                      
//                       <TouchableOpacity 
//                         onPress={() => updateQuantity(item.id, item.quantity + 1)}
//                         style={styles.quantityButton}
//                       >
//                         <Text style={styles.quantityButtonText}>+</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
                  
//                   <View style={styles.rightSection}>
//                     <Text style={styles.itemTotal}>RS {item.totalPrice.toLocaleString()}</Text>
//                     <TouchableOpacity 
//                       onPress={() => removeItem(item.id)}
//                       style={styles.removeButton}
//                     >
//                       <Text style={styles.removeButtonText}>Remove</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />
//           </ScrollView>

//           <View style={styles.footer}>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Total Items:</Text>
//               <Text style={styles.totalValue}>{cartItems.length}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Total Cost:</Text>
//               <Text style={styles.totalAmount}>RS {total.toLocaleString()}</Text>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.deleteAllButton} 
//               onPress={() => clearCart()}
//             >
//               <Text style={styles.deleteAllButtonText}>Clear Cart</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.checkoutButton} 
//               onPress={placeOrder}
//             >
//               <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <Text style={styles.emptySubText}>Add items to get started</Text>
//           <TouchableOpacity 
//             style={styles.shopNowButton}
//             onPress={() => router.push('/explore')}
//           >
//             <Text style={styles.shopNowText}>Shop Now</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {renderAddressModal()}
//       {renderPaymentModal()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.LIGHT_BACKGROUND,
//     paddingHorizontal: 15,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontFamily: 'outfit-bold',
//     fontSize: 24,
//     marginVertical: 20,
//     color: Colors.DARK,
//   },
//   scrollContainer: {
//     flex: 1,
//     marginBottom: 180, // Space for the fixed footer
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 100,
//   },
//   emptyText: {
//     fontFamily: 'outfit-medium',
//     fontSize: 18,
//     color: Colors.DARK,
//     marginBottom: 5,
//   },
//   emptySubText: {
//     fontFamily: 'outfit-regular',
//     fontSize: 14,
//     color: Colors.GRAY,
//     marginBottom: 20,
//   },
//   shopNowButton: {
//     backgroundColor: Colors.PRIMARY,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   shopNowText: {
//     fontFamily: 'outfit-bold',
//     fontSize: 16,
//     color: Colors.WHITE,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: Colors.WHITE,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 15,
//   },
//   itemDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   itemName: {
//     fontFamily: 'outfit-medium',
//     fontSize: 16,
//     color: Colors.DARK,
//     marginBottom: 4,
//   },
//   itemWeight: {
//     fontFamily: 'outfit-regular',
//     fontSize: 14,
//     color: Colors.GRAY,
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontFamily: 'outfit-medium',
//     fontSize: 15,
//     color: Colors.PRIMARY,
//     marginBottom: 10,
//   },
//   quantityRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   quantityButton: {
//     backgroundColor: Colors.LIGHT_PRIMARY,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityButtonText: {
//     color: Colors.PRIMARY,
//     fontSize: 18,
//     fontFamily: 'outfit-bold',
//   },
//   quantityText: {
//     fontFamily: 'outfit-medium',
//     fontSize: 16,
//     marginHorizontal: 15,
//     color: Colors.DARK,
//   },
//   rightSection: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
//   itemTotal: {
//     fontFamily: 'outfit-bold',
//     fontSize: 16,
//     color: Colors.DARK,
//   },
//   removeButton: {
//     backgroundColor: Colors.LIGHT_RED,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     marginTop: 10,
//   },
//   removeButtonText: {
//     fontFamily: 'outfit-medium',
//     fontSize: 12,
//     color: Colors.RED,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.WHITE,
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   totalLabel: {
//     fontFamily: 'outfit-medium',
//     fontSize: 16,
//     color: Colors.DARK,
//   },
//   totalValue: {
//     fontFamily: 'outfit-medium',
//     fontSize: 16,
//     color: Colors.DARK,
//   },
//   totalAmount: {
//     fontFamily: 'outfit-bold',
//     fontSize: 18,
//     color: Colors.PRIMARY,
//   },
//   deleteAllButton: {
//     backgroundColor: Colors.LIGHT_RED,
//     borderRadius: 10,
//     padding: 12,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   deleteAllButtonText: {
//     fontFamily: 'outfit-bold',
//     fontSize: 16,
//     color: Colors.RED,
//   },
//   checkoutButton: {
//     backgroundColor: Colors.PRIMARY,
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//   },
//   checkoutButtonText: {
//     fontFamily: 'outfit-bold',
//     fontSize: 16,
//     color: Colors.WHITE,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: Colors.WHITE,
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: Colors.DARK,
//   },
//   addressInput: {
//     width: '100%',
//     height: 50,
//     borderColor: Colors.GRAY,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     fontFamily: 'outfit-regular',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//   },
//   buttonWrapper: {
//     flex: 1,
//   },
//   buttonGap: {
//     marginHorizontal: 5,
//   },
//   paymentOption: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: Colors.LIGHT_GRAY,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   selectedPayment: {
//     borderColor: Colors.PRIMARY,
//     backgroundColor: Colors.LIGHT_PRIMARY,
//   },
//   paymentText: {
//     fontFamily: 'outfit-medium',
//     fontSize: 16,
//     color: Colors.DARK,
//   },
// });














import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { db } from '../../Config/Firebaseonfig';
import CartHandler from '../../Shared/CartHandler';
import OrderHandler from '../../Shared/OrderHandler';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'react-native';

export default function Cart() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setRefreshing(true);
      const result = await CartHandler.GetCartList(user);
      await fetchCartDetails(result?.cart || {});
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // useEffect(() => {
  //   if (!user) return;

  //   const cartRef = doc(db, 'Cart', user.id);
  //   const unsubscribe = onSnapshot(cartRef, async (doc) => {
  //     if (doc.exists()) {
  //       const cartData = doc.data();
  //       await fetchCartDetails(cartData.cart || {});
  //     } else {
  //       setCartItems([]);
  //       setTotal(0);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [user]);


  const fetchCartDetails = async (cart) => {
    if (!Object.keys(cart)?.length) {
      setCartItems([]);
      setTotal(0);
      return;
    }

    try {
      const ids = Object.keys(cart);
      const q = query(collection(db, 'Items'), where('id', 'in', ids));
      const snapshot = await getDocs(q);

      const items = [];
      let calculatedTotal = 0;
      
      snapshot.forEach(doc => {
        if (doc.exists()) {
          const itemData = doc.data();
          const cartItem = cart[itemData.id];
          const itemTotal = cartItem.quantity * itemData.price;
          
          items.push({
            ...itemData,
            quantity: cartItem.quantity,
            totalPrice: itemTotal
          });
          
          calculatedTotal += itemTotal;
        }
      });
      
      setCartItems(items);
      setTotal(calculatedTotal);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user || newQuantity < 1) return;
    
    try {
      setRefreshing(true);
      const cartData = await CartHandler.GetCartList(user);
      let updatedCart = { ...(cartData.cart || {}) };

      if (newQuantity > 0) {
        updatedCart[itemId] = {
          ...updatedCart[itemId],
          quantity: newQuantity
        };
      } else {
        delete updatedCart[itemId];
      }

      await CartHandler.UpdateCart(user, updatedCart);
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setRefreshing(true);
      const cartData = await CartHandler.GetCartList(user);
      let updatedCart = { ...(cartData.cart || {}) };
      
      delete updatedCart[itemId];
      
      await CartHandler.UpdateCart(user, updatedCart);
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const clearCart = async () => {
    try {
      setRefreshing(true);
      await CartHandler.UpdateCart(user, {});
      await fetchCartItems();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address.length > 0) {
      const { street, city, region, postalCode } = address[0];
      setDeliveryAddress(`${street}, ${city}, ${region}`);
      setPostalCode(postalCode);
    }
  };

  const renderAddressModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Delivery Details</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="Enter your address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          <TextInput
            style={styles.addressInput}
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
          />

          <Button title="Locate Me" onPress={handleLocateMe} color={Colors.PRIMARY} />
  

          <View style={styles.buttonContainer}>
            <View style={[styles.buttonWrapper, styles.buttonGap]}>
              <Button
                title="Continue to Payment"
                onPress={() => {
                  if (!deliveryAddress || !postalCode) {
                    Alert.alert('Error', 'Please enter both delivery address and postal code.');
                    return;
                  }
                  setModalVisible(false);
                  setPaymentModalVisible(true);
                }}
                color={Colors.PRIMARY}
                disabled={!deliveryAddress || !postalCode}
              />
            </View>
            <View style={[styles.buttonWrapper, styles.buttonGap]}>
              <Button 
                title="Cancel" 
                onPress={() => setModalVisible(false)} 
                color={Colors.PRIMARY} 
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={paymentModalVisible}
      onRequestClose={() => setPaymentModalVisible(false)}
    >
      <ImageBackground
        source={require('../../assets/images/bac.jpg')} 
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'COD' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('COD')}
            >
              <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'Card' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('Card')}
            >
              <Text style={styles.paymentText}>Credit/Debit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'BankTransfer' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('BankTransfer')}
            >
              <Text style={styles.paymentText}>Bank Transfer</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <View style={[styles.buttonWrapper, styles.buttonGap]}>
                <Button
                  title="Place Order"
                  onPress={handleAddressSubmit}
                  color={Colors.PRIMARY}
                />
              </View>
              <View style={[styles.buttonWrapper, styles.buttonGap]}>
                <Button 
                  title="Back" 
                  onPress={() => {
                    setPaymentModalVisible(false);
                    setModalVisible(true);
                  }} 
                  color={Colors.PRIMARY} 
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );

  const handleAddressSubmit = async () => {
    try {
      await proceedWithOrder();
      setPaymentModalVisible(false);
      setDeliveryAddress('');
      setPostalCode('');
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const placeOrder = () => {
    Alert.alert(
      'Place Order',
      'Are you sure you want to place this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => setModalVisible(true),
        },
      ]
    );
  };

  const proceedWithOrder = async () => {
    try {
      if (!user || cartItems.length === 0) return;

      const orderId = await OrderHandler.CreateOrder(
        user, 
        cartItems, 
        total,
        deliveryAddress,
        postalCode,
        paymentMethod
      );
      
      if (orderId) {
        await clearCart();
        Alert.alert(
          'Order Placed', 
          'Your order has been placed successfully!',
          [{ 
            text: 'OK',
            onPress: () => router.push({
              // pathname: '/order/OrderDetails',
              pathname: '/orders',
              params: { orderId: orderId.docId }
            })
          }]
        );
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
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
      {cartItems.length > 0 ? (
        <>
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={cartItems}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemWeight}>{item.metalWeight}</Text>
                    <Text style={styles.itemPrice}>RS {item.price.toLocaleString()}</Text>
                    
                    <View style={styles.quantityRow}>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                        disabled={item.quantity <= 1}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.rightSection}>
                    <Text style={styles.itemTotal}>RS {item.totalPrice.toLocaleString()}</Text>
                    <TouchableOpacity 
                      onPress={() => removeItem(item.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalValue}>{cartItems.length}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Cost:</Text>
              <Text style={styles.totalAmount}>RS {total.toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.deleteAllButton} 
              onPress={() => clearCart()}
            >
              <Text style={styles.deleteAllButtonText}>Clear Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={placeOrder}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Add items to get started</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderAddressModal()}
      {renderPaymentModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 180,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: Colors.DARK,
    marginBottom: 5,
  },
  emptySubText: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
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
  cartItem: {
    flexDirection: 'row',
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
    marginBottom: 4,
  },
  itemWeight: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  quantityText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginHorizontal: 15,
    color: Colors.DARK,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.DARK,
  },
  removeButton: {
    backgroundColor: Colors.LIGHT_RED,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  removeButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 12,
    color: Colors.RED,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
  },
  totalValue: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
  },
  totalAmount: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.PRIMARY,
  },
  deleteAllButton: {
    backgroundColor: Colors.LIGHT_RED,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteAllButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.RED,
  },
  checkoutButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.DARK,
  },
  addressInput: {
    width: '100%',
    height: 50,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: 'outfit-regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonGap: {
    marginHorizontal: 5,
  },
  paymentOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPayment: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  paymentText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
  },
});
