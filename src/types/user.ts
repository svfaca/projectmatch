export type UserRole = "creator" | "builder";
export type UserStatus = "active" | "disabled" | "deleted";
export type UserType =
  | "student"
  | "teacher"
  | "professional"
  | "founder"
  | "enthusiast";
export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "junior"
  | "mid"
  | "senior";

export interface User {
  uid: string;
  name: string;
  email: string;
  status?: UserStatus;
  deletedAt?: Date | null;
  photoUrl?: string;
  role: UserRole;
  userType?: UserType | null;
  university?: string | null;
  course?: string | null;
  institution?: string | null;
  professionArea?: string | null;
  professionTitle?: string | null;
  founderMainArea?: string | null;
  founderHasProject?: boolean | null;
  interests?: string[];
  bio?: string | null;
  experienceLevel?: ExperienceLevel | null;
  onboardingCompleted?: boolean;
  skills?: string[];
  github?: string;
  linkedin?: string;
  availability?: string | null;
}
