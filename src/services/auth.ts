import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);

  return {
    uid: result.user.uid,
    name: result.user.displayName ?? "Usuário",
    email: result.user.email ?? "",
    photoUrl: result.user.photoURL ?? undefined,
  };
}

export async function logout() {
  await firebaseSignOut(auth);
}
