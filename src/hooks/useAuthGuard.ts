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
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);

  useEffect(() => {
    let active = true;

    auth
      .authStateReady()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (active) {
          setInitialAuthCheck(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE", user?.uid);

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
        console.log("USER DOC", JSON.stringify(snapshot.data(), null, 2));

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
    console.log(
      "GUARD",
      JSON.stringify(
        {
          pathname,
          loading: state.loading,
          initialAuthCheck,
          uid: state.uid,
          role: state.role,
          onboardingCompleted: state.onboardingCompleted,
          status: state.status,
        },
        null,
        2,
      ),
    );

    if (state.loading || !initialAuthCheck) {
      return;
    }

    if (!state.uid) {
      if (!isPublicRoute(pathname)) {
        console.log("REDIRECT ->", "/");
        router.replace("/");
      }

      return;
    }

    if (state.status === "deleted") {
      if (pathname !== "/") {
        console.log("REDIRECT ->", "/");
        router.replace("/");
      }

      return;
    }

    if (!state.onboardingCompleted && pathname !== "/onboarding") {
      console.log("REDIRECT ->", "/onboarding");
      router.replace("/onboarding");
      return;
    }

    if (pathname === "/onboarding" && state.onboardingCompleted) {
      const destination = resolveRoleHome(state.role);
      console.log("REDIRECT ->", destination);
      router.replace(destination);
      return;
    }

    if (pathname === "/" || pathname === "/login") {
      const destination = resolveRoleHome(state.role);
      console.log("REDIRECT ->", destination);
      router.replace(destination);
      return;
    }

    if (pathname.startsWith("/creator") && state.role !== "creator") {
      const destination = resolveRoleHome(state.role);
      console.log("REDIRECT ->", destination);
      router.replace(destination);
      return;
    }

    if (pathname.startsWith("/builder") && state.role !== "builder") {
      const destination = resolveRoleHome(state.role);
      console.log("REDIRECT ->", destination);
      router.replace(destination);
    }
  }, [
    pathname,
    initialAuthCheck,
    state.loading,
    state.onboardingCompleted,
    state.role,
    state.uid,
    state.status,
  ]);

  return state.loading;
}
