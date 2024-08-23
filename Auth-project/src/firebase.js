// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-10851.firebaseapp.com",
  projectId: "mern-auth-10851",
  storageBucket: "mern-auth-10851.appspot.com",
  messagingSenderId: "117719165122",
  appId: "1:117719165122:web:72475694fce3ebef23735b"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 