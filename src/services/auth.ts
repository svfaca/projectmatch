import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "./firebase";

type GoogleAuthTokens = {
  idToken?: string | null;
  accessToken?: string | null;
};

export async function signInWithGoogle(tokens: GoogleAuthTokens) {
  const credential = GoogleAuthProvider.credential(
    tokens.idToken ?? null,
    tokens.accessToken ?? null,
  );

  const result = await signInWithCredential(auth, credential);

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
