import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC_xvoFgGAG20BKJjsmoK1Ho8ac04DchU",
  authDomain: "cycle-calendar-f0a83.firebaseapp.com",
  projectId: "cycle-calendar-f0a83",
  storageBucket: "cycle-calendar-f0a83.firebasestorage.app",
  messagingSenderId: "37156355943",
  appId: "1:37156355943:web:a76816a54e89fa906e79c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, addDoc, getDocs }