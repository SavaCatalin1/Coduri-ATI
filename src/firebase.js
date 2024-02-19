// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhwJM7x3qNfsvi2C5s0vMvrSlqwYfFjNE",
  authDomain: "coduri-ati.firebaseapp.com",
  projectId: "coduri-ati",
  storageBucket: "coduri-ati.appspot.com",
  messagingSenderId: "918604688886",
  appId: "1:918604688886:web:1643279825a2bfc4e4abd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);