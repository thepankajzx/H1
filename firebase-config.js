import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, linkWithPhoneNumber, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, enableIndexedDbPersistence, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where, documentId } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPGblfC8LRdFgZFyx_-WlRwCoDJ2gnpfY",
  authDomain: "definite-01.firebaseapp.com",
  projectId: "definite-01",
  storageBucket: "definite-01.firebasestorage.app",
  messagingSenderId: "1051865956755",
  appId: "1:1051865956755:web:b2235648d4274a635aa866",
  measurementId: "G-0J960ZQX7L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firebase persistence error:", err.code);
});

const googleProvider = new GoogleAuthProvider();

// Expose globally for inline scripts in HTML
window.firebaseAuth = auth;
window.firebaseDb = db;
window.googleProvider = googleProvider;
window.signInWithPopup = signInWithPopup;
window.RecaptchaVerifier = RecaptchaVerifier;
window.signInWithPhoneNumber = signInWithPhoneNumber;
window.linkWithPhoneNumber = linkWithPhoneNumber;
window.onAuthStateChanged = onAuthStateChanged;
window.signOut = signOut;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.collection = collection;
window.getDocs = getDocs;
window.query = query;
window.where = where;
window.documentId = documentId;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.sendPasswordResetEmail = sendPasswordResetEmail;
window.sendEmailVerification = sendEmailVerification;

console.log("Firebase initialized successfully.");
