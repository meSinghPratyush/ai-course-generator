// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-course-generator-63bd6.firebaseapp.com",
  projectId: "ai-course-generator-63bd6",
  storageBucket: "ai-course-generator-63bd6.firebasestorage.app",
  messagingSenderId: "527973736457",
  appId: "1:527973736457:web:5bf0f8d2b7f6c02411d8d8",
  measurementId: "G-LYTGJY2SBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);