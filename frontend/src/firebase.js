import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import for Authentication
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDmEiZ6fTJ8ElVXGaJxFBPTsmU2kXntQrA",
  authDomain: "podstream-8367e.firebaseapp.com",
  projectId: "podstream-8367e",
  storageBucket: "podstream-8367e.appspot.com",
  messagingSenderId: "765841884089",
  appId: "1:765841884089:web:1d43bf93cd7a06491aac68",
  measurementId: "G-FECJVYFL9F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app); // Export auth instance
