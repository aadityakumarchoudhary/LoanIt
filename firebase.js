// Firebase Configuration - LoanIt
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSiOreTkVv4eIEYcqLd94UiWcR_910xR0",
  authDomain: "loanit-84e54.firebaseapp.com",
  projectId: "loanit-84e54",
  storageBucket: "loanit-84e54.firebasestorage.app",
  messagingSenderId: "932792542373",
  appId: "1:932792542373:web:08cfdd71d6331edd94594c",
  measurementId: "G-FT06CHFZJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp };