import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1RV_5v2po5zliPTjcYw8hVTSaxaPVp2M",
  authDomain: "kanban-board-5f12a.firebaseapp.com",
  projectId: "kanban-board-5f12a",
  storageBucket: "kanban-board-5f12a.firebasestorage.app",
  messagingSenderId: "889906910606",
  appId: "1:889906910606:web:167d708f8eee56bf4880df",
  measurementId: "G-RWSVKK92KG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);