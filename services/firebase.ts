
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// These values are placeholders. In a production environment, 
// you would use environment variables or a direct config from the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyBMUCEnb3e__-bM4IEenbPO6AiLDG5orxY",
  authDomain: "notes-app-re.firebaseapp.com",
  projectId: "notes-app-re",
  storageBucket: "notes-app-re.firebasestorage.app",
  messagingSenderId: "463869728957",
  appId: "1:463869728957:web:acf1f482ef8db2cf49ffd4"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously for a seamless "Full Firebase" experience without forcing a login form immediately
signInAnonymously(auth).catch((error) => {
  console.error("Firebase Auth Error:", error.code, error.message);
});
