// ============================================================
// FILE: frontend/src/config/firebase.js
// PURPOSE: Initializes Firebase and exports all Firebase services
//   that the frontend will use.
//
// WHY THIS FILE EXISTS:
//   Firebase needs to be "initialized" once with your project
//   credentials before you can use it. This file does that and
//   then exports the services (auth, db, storage) so that other
//   files can import them directly.
//
// SERVICES EXPORTED:
//   - app           → The Firebase app instance
//   - auth          → Firebase Authentication (login, register)
//   - db            → Firebase Firestore (database)
//   - storage       → Firebase Storage (file uploads)
//   - messaging     → Firebase Cloud Messaging (push notifications)
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration — values come from environment variables
// in the .env file (which you copy from .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (only runs once, even if imported multiple times)
const app = initializeApp(firebaseConfig);

// Initialize and export individual Firebase services
export const auth = getAuth(app);       // For login, register, logout
export const db = getFirestore(app);    // For database operations
export const storage = getStorage(app); // For file uploads (photos, PDFs)

export default app;
