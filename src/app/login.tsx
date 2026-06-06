import {
  AppButton,
  BrandMark,
  ModernScreen,
  SurfaceCard,
  palette,
} from "@/components/ui/projectmatch-ui";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { signInWithGoogle } from "../services/auth";
import { getUserProfile, reactivateUserAccount } from "../services/users";

export default function LoginScreen() {
  async function handleGoogleLogin() {
    try {
      const user = await signInWithGoogle();

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
