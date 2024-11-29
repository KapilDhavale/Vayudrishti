// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDIFGbH0zAFsCrlz4fmzRnIo8f6nkhiJrM",
  authDomain: "sih2024-1bae3.firebaseapp.com",
  databaseURL:
    "https://sih2024-1bae3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sih2024-1bae3",
  storageBucket: "sih2024-1bae3.firebasestorage.app",
  messagingSenderId: "700535759291",
  appId: "1:700535759291:web:79de79c40c93744997a49e",
  measurementId: "G-2LBFCLVQLM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Authentication service
const auth = getAuth(app);

export { auth };
