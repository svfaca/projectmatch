import type { UserRole, UserStatus } from "@/types/user";
import { getUserProfile } from "./users";

export type SessionSnapshot = {
  role: UserRole | null;
  onboardingCompleted: boolean;
  status: UserStatus;
};

export function isPublicRoute(pathname: string) {
  return pathname === "/" || pathname === "/login";
}

export function resolveRoleHome(role: UserRole | null) {
  if (!role) {
    return "/onboarding";
  }

  return role === "creator" ? "/creator" : "/builder";
}

export async function getSessionSnapshot(
  uid: string,
): Promise<SessionSnapshot> {
  console.log("SESSION UID", uid);

  const profile = await getUserProfile(uid);

  return {
    role: profile?.role ?? null,
    onboardingCompleted: profile?.onboardingCompleted === true,
    status: profile?.status ?? "active",
  };
}
