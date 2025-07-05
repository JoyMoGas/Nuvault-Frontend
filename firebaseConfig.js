// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCdjDHTEYg1Wc6EE-NmSTAqJd7lbNGERQ",
  authDomain: "nuvault-auth.firebaseapp.com",
  projectId: "nuvault-auth",
  storageBucket: "nuvault-auth.firebasestorage.app",
  messagingSenderId: "353964303816",
  appId: "1:353964303816:web:beb2803cbbb734f4e84cfd",
  measurementId: "G-LCNBZHBV1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);