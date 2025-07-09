import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCn_NhZTx6b84YuiqrQMOgm_jsH8eXGAOI",
    authDomain: "e-delivery-3312f.firebaseapp.com",
    projectId: "e-delivery-3312f",
    storageBucket: "e-delivery-3312f.appspot.com",
    messagingSenderId: "911486002224",
    appId: "1:911486002224:web:5fe36975579d448213f9f5"
};

// Initialize Firebase app first
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only if you're using it)
const analytics = getAnalytics(app);