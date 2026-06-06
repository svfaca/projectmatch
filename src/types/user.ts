export type UserRole = "creator" | "builder";
export type UserStatus = "active" | "disabled" | "deleted";

export interface User {
  uid: string;
  name: string;
  email: string;
  status?: UserStatus;
  deletedAt?: Date | null;
  photoUrl?: string;
  role: UserRole;
  university?: string;
  course?: string;
  onboardingCompleted?: boolean;
  skills?: string[];
  github?: string;
  linkedin?: string;
  availability?: string;
}
