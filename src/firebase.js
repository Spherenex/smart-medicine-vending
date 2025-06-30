// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXHnvNZkb00PXbG5JidbD4PbRgf7l6Lgg",
    authDomain: "v2v-communication-d46c6.firebaseapp.com",
    databaseURL: "https://v2v-communication-d46c6-default-rtdb.firebaseio.com",
    projectId: "v2v-communication-d46c6",
    storageBucket: "v2v-communication-d46c6.firebasestorage.app",
    messagingSenderId: "536888356116",
    appId: "1:536888356116:web:c6bbab9c6faae7c84e2601",
    measurementId: "G-FXLP4KQXWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;