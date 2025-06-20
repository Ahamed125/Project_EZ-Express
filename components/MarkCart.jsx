// import { useUser } from '@clerk/clerk-expo';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
// import CartHandler from '../Shared/CartHandler';
// import Colors from './../constant/Colors';

// export default function MarkCart({ itm }) {
//   const { user } = useUser();
//   const [inCart, setInCart] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user || !itm?.id) return;
    
//     const checkCartStatus = async () => {
//       setLoading(true);
//       try {
//         const cartData = await CartHandler.GetCartList(user);
//         setInCart(cartData?.cart?.includes(itm.id));
//       } catch (error) {
//         console.error("Error checking cart status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkCartStatus();
//   }, [user, itm?.id]);

//   const toggleCart = async () => {
//     if (!user || loading) return;
    
//     setLoading(true);
//     try {
//       const cartData = await CartHandler.GetCartList(user);
//       let updatedCart = [...(cartData.cart || [])];

//       if (inCart) {
//         updatedCart = updatedCart.filter(id => id !== itm.id);
//       } else {
//         if (!updatedCart.includes(itm.id)) {
//           updatedCart.push(itm.id);
//         }
//       }

//       await CartHandler.UpdateCart(user, updatedCart);
//       setInCart(!inCart);
//     } catch (error) {
//       console.error("Error toggling cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="small" color={Colors.PRIMARY} />;
//   }

//   return (
//     <TouchableOpacity
//       onPress={toggleCart}
//       disabled={loading}
//       style={{
//         backgroundColor: inCart ? Colors.GRAY : Colors.PRIMARY,
//         paddingVertical: 6,
//         paddingHorizontal: 15,
//         borderRadius: 8,
//         opacity: loading ? 0.7 : 1,
//       }}
//     >
//       <Text style={{ color: 'white', fontFamily: 'outfit-medium' }}>
//         {inCart ? 'Remove from Cart' : 'Add to Cart'}
//       </Text>
//     </TouchableOpacity>
//   );
// }
















import { useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CartHandler from '../Shared/CartHandler';
import Colors from '../constant/Colors';

export default function MarkCart({ itm }) {
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !itm?.id) return;
    
    const checkCartStatus = async () => {
      setLoading(true);
      try {
        const cartData = await CartHandler.GetCartList(user);
        const itemInCart = cartData?.cart?.[itm.id];
        setIsInCart(!!itemInCart);
        if (itemInCart) {
          setQuantity(itemInCart.quantity || 1);
        }
      } catch (error) {
        console.error("Error checking cart status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCartStatus();
  }, [user, itm?.id]);

  const addToCart = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const cartData = await CartHandler.GetCartList(user);
      let updatedCart = { ...(cartData.cart || {}) };

      updatedCart[itm.id] = {
        quantity: 1,
        price: itm.price,
        name: itm.name,
        imageUrl: itm.imageUrl
      };

      await CartHandler.UpdateCart(user, updatedCart);
      setIsInCart(true);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const cartData = await CartHandler.GetCartList(user);
      let updatedCart = { ...(cartData.cart || {}) };

      delete updatedCart[itm.id];

      await CartHandler.UpdateCart(user, updatedCart);
      setIsInCart(false);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (newQuantity) => {
    if (!user || loading || newQuantity < 1) return;
    
    setLoading(true);
    try {
      const cartData = await CartHandler.GetCartList(user);
      let updatedCart = { ...(cartData.cart || {}) };

      updatedCart[itm.id] = {
        ...updatedCart[itm.id],
        quantity: newQuantity
      };

      await CartHandler.UpdateCart(user, updatedCart);
      setQuantity(newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const increment = () => updateQuantity(quantity + 1);
  const decrement = () => updateQuantity(quantity - 1);

  if (loading) {
    return <ActivityIndicator size="small" color={Colors.PRIMARY} />;
  }

  return (
    <View style={styles.container}>
      {isInCart ? (
        <>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decrement} style={styles.quantityButton}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={increment} style={styles.quantityButton}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={removeFromCart}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={addToCart}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  quantityButton: {
    backgroundColor: Colors.PRIMARY,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'outfit-medium',
  },
  removeButton: {
    backgroundColor: Colors.GRAY,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontFamily: 'outfit-medium',
    fontSize: 12,
  },
});