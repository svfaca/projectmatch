import { auth, db } from "@/services/firebase";
import { isPublicRoute, resolveRoleHome } from "@/services/session";
import type { User } from "@/types/user";
import { router, usePathname } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type GuardState = {
  loading: boolean;
  uid: string | null;
  role: "creator" | "builder" | null;
  onboardingCompleted: boolean;
  status: "active" | "disabled" | "deleted" | null;
};

const initialState: GuardState = {
  loading: true,
  uid: null,
  role: null,
  onboardingCompleted: false,
  status: null,
};

export function useAuthGuard() {
  const pathname = usePathname();
  const [state, setState] = useState<GuardState>(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("GUARD AUTH STATE", {
        uid: user?.uid ?? null,
        pathname,
      });

      if (!user) {
        setState({
          loading: false,
          uid: null,
          role: null,
          onboardingCompleted: false,
          status: null,
        });
        return;
      }

      setState({
        loading: true,
        uid: user.uid,
        role: null,
        onboardingCompleted: false,
        status: null,
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!state.uid) {
      return;
    }

    const userRef = doc(db, "users", state.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.data() as User | undefined;

        setState((current) => ({
          ...current,
          loading: false,
          uid: state.uid,
          role:
            data?.role === "creator" || data?.role === "builder"
              ? data.role
              : null,
          onboardingCompleted: data?.onboardingCompleted === true,
          status: data?.status ?? "active",
        }));
      },
      (error) => {
        console.error(error);
        setState((current) => ({
          ...current,
          loading: false,
          uid: state.uid,
          role: null,
          onboardingCompleted: false,
          status: null,
        }));
      },
    );

    return unsubscribe;
  }, [state.uid]);

  useEffect(() => {
    if (state.loading) {
      return;
    }

    console.log("GUARD ROUTE CHECK", {
      pathname,
      uid: state.uid,
      role: state.role,
      onboardingCompleted: state.onboardingCompleted,
      status: state.status,
    });

    if (!state.uid) {
      if (!isPublicRoute(pathname)) {
        console.log("GUARD -> HOME");
        router.replace("/");
      }

      return;
    }

    if (state.status === "deleted") {
      if (pathname !== "/login") {
        console.log("GUARD -> LOGIN");
        router.replace("/login");
      }

      return;
    }

    if (!state.onboardingCompleted && pathname !== "/onboarding") {
      console.log("GUARD -> ONBOARDING");
      router.replace("/onboarding");
      return;
    }

    if (pathname === "/onboarding" && state.onboardingCompleted) {
      console.log("GUARD -> ROLE HOME", resolveRoleHome(state.role));
      router.replace(resolveRoleHome(state.role));
      return;
    }

    if (pathname === "/" || pathname === "/login") {
      console.log("GUARD -> ROLE HOME", resolveRoleHome(state.role));
      router.replace(resolveRoleHome(state.role));
      return;
    }

    if (pathname.startsWith("/creator") && state.role !== "creator") {
      console.log("GUARD -> ROLE HOME", resolveRoleHome(state.role));
      router.replace(resolveRoleHome(state.role));
      return;
    }

    if (pathname.startsWith("/builder") && state.role !== "builder") {
      console.log("GUARD -> ROLE HOME", resolveRoleHome(state.role));
      router.replace(resolveRoleHome(state.role));
    }
  }, [
    pathname,
    state.loading,
    state.onboardingCompleted,
    state.role,
    state.uid,
    state.status,
  ]);

  return state.loading;
}
