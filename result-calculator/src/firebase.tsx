import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Configuration
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
const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Load JSON Data & Upload to Firestore
async function uploadData() {
  try {
    const response = await fetch('/results.json');
    if (!response.ok) throw new Error("Failed to fetch JSON file.");

    const data = await response.json();
    const resultsArray = data.results || []; // Get the "results" array

    for (const item of resultsArray) {
      const rollNumber = item.roll_number; // 🔹 Use roll number as ID
      if (!rollNumber) {
        console.warn("Skipping document without roll_number:", item);
        continue;
      }

      await setDoc(doc(db, "semester", rollNumber), item); // 🔹 Set roll number as document ID
    }

    console.log("✅ Data uploaded successfully with roll numbers as document IDs!");
  } catch (error) {
    console.error("❌ Error uploading data:", error);
  }
}

// ✅ Call Upload Function When Page Loads
document.addEventListener("DOMContentLoaded", uploadData);
