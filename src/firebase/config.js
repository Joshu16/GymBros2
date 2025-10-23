import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getCurrentDomain } from './domains';

const firebaseConfig = {
  apiKey: "AIzaSyCRhNNuJ4qu0xJNQsX5-cXdCVko8CPkr3M",
  authDomain: "gymbros-c21df.firebaseapp.com",
  projectId: "gymbros-c21df",
  storageBucket: "gymbros-c21df.firebasestorage.app",
  messagingSenderId: "1080056611729",
  appId: "1:1080056611729:web:3a8aee4b5830b88d9f5030"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Log current domain for debugging
console.log('Firebase initialized for domain:', getCurrentDomain());

export default app;
