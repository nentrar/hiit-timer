import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPqL7ohuzpKrfcJ77I4t_xvHVSehvmLMo",
  authDomain: "hiit-timer-e1133.firebaseapp.com",
  projectId: "hiit-timer-e1133",
  storageBucket: "hiit-timer-e1133.firebasestorage.app",
  messagingSenderId: "442777687005",
  appId: "1:442777687005:web:cef9721c7ff71dfda65c34",
  measurementId: "G-JMMQ52KGVV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;