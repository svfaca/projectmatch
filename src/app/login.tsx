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
import { Alert, StyleSheet, Text, View } from "react-native";
import { signInWithGoogle } from "../services/auth";
import { getUserProfile, reactivateUserAccount } from "../services/users";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  "153548150031-ahiq9fl61q04iuq63d9n1ojehj5200mg.apps.googleusercontent.com";

export default function LoginScreen() {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    selectAccount: true,
  });

  async function handleGoogleLogin() {
    try {
      const response = await promptAsync();

      if (response.type !== "success") {
        return;
      }

      const idToken =
        response.authentication?.idToken ?? response.params.id_token;
      const accessToken =
        response.authentication?.accessToken ?? response.params.access_token;

      const user = await signInWithGoogle({ idToken, accessToken });

      console.log("LOGIN UID", user.uid);
      console.log("LOGIN EMAIL", user.email);

      let profile = null;

      try {
        profile = await getUserProfile(user.uid);
      } catch (profileError) {
        console.error("LOGIN PROFILE FETCH FAILED", profileError);
        throw profileError;
      }

      console.log("LOGIN PROFILE", JSON.stringify(profile, null, 2));

      if (!profile) {
        console.log("PROFILE NÃO EXISTE");
      }

      if (profile?.status === "deleted") {
        console.log("LOGIN ACCOUNT REACTIVATION", user.uid);
        await reactivateUserAccount(user.uid);
        profile = {
          ...profile,
          status: "active",
          deletedAt: null,
          onboardingCompleted: false,
          role: null,
        };
      }

      if (profile?.onboardingCompleted) {
        console.log("VAI PARA DASHBOARD", profile.role);
      }

      if (!profile || profile.onboardingCompleted !== true) {
        console.log("LOGIN NEXT ROUTE", "/onboarding");
        console.log("ANTES DO ROUTER", "/onboarding");
        router.replace("/onboarding");
        console.log("DEPOIS DO ROUTER", "/onboarding");
        return;
      }

      const nextRoute = profile.role === "creator" ? "/creator" : "/builder";

      console.log("LOGIN NEXT ROUTE", nextRoute);
      console.log("ANTES DO ROUTER", nextRoute);
      router.replace(nextRoute);
      console.log("DEPOIS DO ROUTER", nextRoute);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro no login", "Não foi possível entrar com Google.");
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
          title="Continuar com Google"
          onPress={handleGoogleLogin}
          disabled={!request}
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
