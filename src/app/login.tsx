import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleText}>Continuar com Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1020",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  googleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4285F4",
    borderRadius: 5,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
