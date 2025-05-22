// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAu66TpyB3U-EC68XEGif5cuKr3_ZHiKo",
  authDomain: "projetofellas-ca9ad.firebaseapp.com",
  projectId: "projetofellas-ca9ad",
  storageBucket: "projetofellas-ca9ad.firebasestorage.app",
  messagingSenderId: "149542503414",
  appId: "1:149542503414:web:d230236ace634364adbdd7",
  measurementId: "G-GFXT9J5Q2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, app, storage };