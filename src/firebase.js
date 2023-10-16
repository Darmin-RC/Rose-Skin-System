import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "roseskinsystemm.firebaseapp.com",
  projectId: "roseskinsystemm",
  storageBucket: "roseskinsystemm.appspot.com",
  messagingSenderId: "520269168036",
  appId: "1:520269168036:web:7acaca38762c76a8ed9531"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };