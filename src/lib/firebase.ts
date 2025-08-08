// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "examprep-ai-a07qg",
  "appId": "1:229110796294:web:1dcdc5c8907ede01d2b387",
  "storageBucket": "examprep-ai-a07qg.firebasestorage.app",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "authDomain": "examprep-ai-a07qg.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "229110796294"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
