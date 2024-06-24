// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyWwMuMQgkyyhRiioeggLRmFPZPdk5VPc",
  authDomain: "note-app-c8bbd.firebaseapp.com",
  projectId: "note-app-c8bbd",
  storageBucket: "note-app-c8bbd.appspot.com",
  messagingSenderId: "1017924619107",
  appId: "1:1017924619107:web:592334243ecea2e2992156",
  measurementId: "G-ELNHK1L5F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)