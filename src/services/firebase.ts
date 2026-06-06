import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0E6zAlxsNwctCjIAvWd0IciDtNl3taPg",
  authDomain: "projectmatch-beta.firebaseapp.com",
  projectId: "projectmatch-beta",
  storageBucket: "projectmatch-beta.firebasestorage.app",
  messagingSenderId: "153548150031",
  appId: "1:153548150031:web:c057c25f4effb398f49a7a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
