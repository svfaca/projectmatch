import type { Project } from "@/types/project";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function getProjects(): Promise<Project[]> {
  return [];
}

export async function createProject(payload: {
  title: string;
  problem?: string;
  description?: string;
  objective?: string;
  requiredSkills?: string[];
  membersCount?: number;
  ownerId: string;
}) {
  const docRef = await addDoc(collection(db, "projects"), {
    title: payload.title,
    problem: payload.problem ?? "",
    description: payload.description ?? "",
    objective: payload.objective ?? "",
    requiredSkills: payload.requiredSkills ?? [],
    membersCount: payload.membersCount ?? 0,
    ownerId: payload.ownerId,
    status: "active",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
