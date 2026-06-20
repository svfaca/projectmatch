import type { User } from "@/types/user";
import {
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function getUsers(): Promise<User[]> {
  return [];
}

export async function saveAuthenticatedUser(
  user: Pick<User, "uid" | "name" | "email" | "photoUrl">,
) {
  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    removeUndefined({
      uid: user.uid,
      name: user.name,
      email: user.email,
      ...(!userSnapshot.exists()
        ? {
            status: "active",
            deletedAt: null,
          }
        : {}),
      ...(user.photoUrl ? { photoUrl: user.photoUrl } : {}),
      ...(!userSnapshot.exists() ? { createdAt: serverTimestamp() } : {}),
    }),
    { merge: true },
  );
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Omit<User, "uid">;

  return {
    ...data,
    uid: snapshot.id,
    status: data.status ?? "active",
    deletedAt: data.deletedAt ?? null,
    onboardingCompleted: data.onboardingCompleted === true,
  };
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, "name" | "email" | "photoUrl">>,
) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    removeUndefined({
      ...data,
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  );
}

export async function markUserAsDeleted(uid: string) {
  await updateDoc(doc(db, "users", uid), {
    status: "deleted",
    deletedAt: serverTimestamp(),
    onboardingCompleted: false,
    role: deleteField(),
    university: deleteField(),
    course: deleteField(),
    skills: deleteField(),
    github: deleteField(),
    linkedin: deleteField(),
    availability: deleteField(),
    updatedAt: serverTimestamp(),
  });
}

export async function reactivateUserAccount(uid: string) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    removeUndefined({
      status: "active",
      deletedAt: null,
      onboardingCompleted: false,
      role: null,
      university: null,
      course: null,
      skills: null,
      github: null,
      linkedin: null,
      availability: null,
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  );
}

export async function saveOnboardingData(
  uid: string,
  data: Partial<User> & { onboardingCompleted?: boolean },
) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    removeUndefined({
      uid,
      ...data,
      status: "active",
      onboardingCompleted: data.onboardingCompleted ?? true,
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  );
}
