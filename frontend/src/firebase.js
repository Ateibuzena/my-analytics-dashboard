import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


const firebaseConfig = {
apiKey: 
authDomain: "my-analytics-300ac.firebaseapp.com", // authDomain = ID del proyecto + ".firebaseapp.com"
projectId: "my-analytics-300ac", // ID del proyecto
storageBucket: "my-analytics-300ac.appspot.com", // storageBucket = ID del proyecto + ".appspot.com"
messagingSenderId: "192368342259", // Número del proyecto
appId: "1:192368342259:web:a2037b7dc7f01c9804b386" // appId que ya tienes
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db, doc, setDoc, getDoc };
