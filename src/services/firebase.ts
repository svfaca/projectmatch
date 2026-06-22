import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: getRequiredEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getRequiredEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getRequiredEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getRequiredEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getRequiredEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
};

console.log(
  'FirebaseAuth exports:',
  Object.keys(FirebaseAuth).filter(k =>
    k.toLowerCase().includes('persistence') ||
    k.toLowerCase().includes('auth')
  )
);

console.log(
  'getReactNativePersistence type:',
  typeof (FirebaseAuth as any).getReactNativePersistence
);

const app = initializeApp(firebaseConfig);

const getReactNativePersistence = (
  FirebaseAuth as unknown as {
    getReactNativePersistence: (
      storage: typeof AsyncStorage,
    ) => FirebaseAuth.Persistence;
  }
).getReactNativePersistence;

export const auth = FirebaseAuth.initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export default app;
