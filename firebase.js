// ==========================================
// BKTech Computer & Library
// Firebase Configuration
// File: public/js/firebase.js
// ==========================================

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0DdieGno28CFvAYpkVYx4wJybzijkfY4",
  authDomain: "bktech-306e3.firebaseapp.com",
  projectId: "bktech-306e3",
  storageBucket: "bktech-306e3.firebasestorage.app",
  messagingSenderId: "98105656800",
  appId: "1:98105656800:web:8ae1f8d686666d70e59785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Services
export {
  app,
  auth,
  db,
  storage,
  firebaseConfig
};