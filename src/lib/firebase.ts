import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Same Firebase project as Samachar-Sathi & Pariksha-Sathi — SSO works automatically
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6Cpg83N8fBuvY7YOSwTWsfM9DUsaVc3E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pariksha-sathi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pariksha-sathi",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pariksha-sathi.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "921721697043",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:921721697043:web:dada90a420c40e11ae60e6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NC7955J7KV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
