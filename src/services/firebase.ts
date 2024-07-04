// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { getFirestore, Firestore } from "firebase/firestore";

const initializeFirebase = (): FirebaseApp => {
  const firebaseConfig = {
    apiKey: "AIzaSyCd4U1gYKqjNU6Q9lsxc-x1TDMghvoL9eM",
    authDomain: "disk-calculator-1e6a5.firebaseapp.com",
    projectId: "disk-calculator-1e6a5",
    storageBucket: "disk-calculator-1e6a5.appspot.com",
    messagingSenderId: "245298750839",
    appId: "1:245298750839:web:5b158c2bc9aa81b91b2d72",
    measurementId: "G-JMLTKDZZYD"
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};

export const initializeDb = (): Firestore => {
  const app = initializeFirebase()
  const db = getFirestore(app);
  return db;
};