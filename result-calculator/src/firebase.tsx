// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMO090YOZ0zN64blKLnOGKFAGWKYvqbkI",
  authDomain: "result-app-b25d1.firebaseapp.com",
  projectId: "result-app-b25d1",
  storageBucket: "result-app-b25d1.firebasestorage.app",
  messagingSenderId: "417527850673",
  appId: "1:417527850673:web:9b41de7cf07734d6eaa490",
  measurementId: "G-G5DCQV8F0B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);