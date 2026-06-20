import {
    AppButton,
    BrandMark,
    ModernScreen,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { signInWithGoogle } from "../services/auth";
import { getUserProfile, reactivateUserAccount } from "../services/users";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

async function loadGoogleSignin() {
  return import("@react-native-google-signin/google-signin");
}

function isGoogleSigninError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

export default function LoginScreen() {
  const isWeb = Platform.OS === "web";
  const hasWebGoogleConfig = Boolean(WEB_CLIENT_ID && ANDROID_CLIENT_ID);
  const hasNativeGoogleConfig = Boolean(WEB_CLIENT_ID);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    selectAccount: true,
  });

  useEffect(() => {
    if (isWeb || !hasNativeGoogleConfig) {
      return;
    }

    let isMounted = true;

    void (async () => {
      try {
        const { GoogleSignin } = await loadGoogleSignin();

        if (!isMounted) {
          return;
        }

        GoogleSignin.configure({
          webClientId: WEB_CLIENT_ID,
        });
      } catch (error) {
        console.error("Failed to load Google Sign-In native module", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [hasNativeGoogleConfig, isWeb]);

  async function resolvePostLoginRoute(uid: string) {
    let profile = null;

    try {
      profile = await getUserProfile(uid);
    } catch (profileError) {
      console.error("LOGIN PROFILE FETCH FAILED", profileError);
      throw profileError;
    }

    if (profile?.status === "deleted") {
      await reactivateUserAccount(uid);
      profile = {
        ...profile,
        status: "active",
        deletedAt: null,
        onboardingCompleted: false,
        role: null,
      };
    }

    if (!profile || profile.onboardingCompleted !== true) {
      router.replace("/onboarding");
      return;
    }

    const nextRoute = profile.role === "creator" ? "/creator" : "/builder";
    router.replace(nextRoute);
  }

  async function handleGoogleLogin() {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);

    try {
      if (isWeb) {
        if (!hasWebGoogleConfig) {
          Alert.alert(
            "Configuração ausente",
            "Defina EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID e EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID.",
          );
          return;
        }

        const response = await promptAsync();

        if (response.type !== "success") {
          return;
        }

        const idToken =
          response.authentication?.idToken ?? response.params.id_token;
        const accessToken =
          response.authentication?.accessToken ?? response.params.access_token;

        const user = await signInWithGoogle({ idToken, accessToken });
        await resolvePostLoginRoute(user.uid);
        return;
      }

      if (!hasNativeGoogleConfig) {
        Alert.alert(
          "Configuração ausente",
          "Defina EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para login no Android.",
        );
        return;
      }

      const { GoogleSignin } = await loadGoogleSignin();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();

      if (response.type !== "success") {
        return;
      }

      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error("Google sign-in retornou sem idToken.");
      }

      const user = await signInWithGoogle({ idToken });
      await resolvePostLoginRoute(user.uid);
    } catch (error) {
      if (isGoogleSigninError(error)) {
        if (error.code === "IN_PROGRESS") {
          return;
        }

        if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
          Alert.alert(
            "Google Play Services indisponível",
            "Atualize ou habilite o Google Play Services para continuar.",
          );
          return;
        }

        if (error.code === "SIGN_IN_CANCELLED") {
          return;
        }
      }

      console.error(error);
      Alert.alert("Erro no login", "Não foi possível entrar com Google.");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <ModernScreen contentStyle={styles.container}>
      <SurfaceCard style={styles.card}>
        <BrandMark compact />

        <View style={styles.textBlock}>
          <Text style={styles.kicker}>Bem-vindo de volta</Text>
          <Text style={styles.title}>
            Entre para continuar construindo projetos.
          </Text>
          <Text style={styles.subtitle}>
            Use sua conta Google para acessar projetos, conexões e conversas em
            andamento.
          </Text>
        </View>

        <AppButton
          title={isSigningIn ? "Entrando..." : "Continuar com Google"}
          onPress={handleGoogleLogin}
          disabled={
            isSigningIn ||
            (isWeb ? !request || !hasWebGoogleConfig : !hasNativeGoogleConfig)
          }
          leadingElement={
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
          }
        />
      </SurfaceCard>
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    gap: 20,
  },
  textBlock: {
    gap: 10,
  },
  kicker: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: palette.textPrimary,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: {
    color: "#4285F4",
    fontSize: 13,
    fontWeight: "800",
  },
});
