import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Config/Firebaseonfig";

export const GetCartList = async (user) => {
  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return { cart: {} }; // Changed to object to store quantities

    const docRef = doc(db, 'UserCartItem', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(docRef, {
        email: email,
        
        cart: {}, // Changed to object
      });
      return { cart: {} };
    }
  } catch (error) {
    console.error("Error getting cart list:", error);
    return { cart: {} };
  }
};

export const UpdateCart = async (user, cart) => {
  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const docRef = doc(db, 'UserCartItem', email);
    await updateDoc(docRef, { cart });
  } catch (e) {
    console.error('Failed to update cart:', e);
  }
};

export default {
  GetCartList,
  UpdateCart,
};