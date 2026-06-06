import "../services/firebase";

console.log("Firebase conectado");

import { ROLE_STORAGE_KEY } from "@/constants/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  async function handleStart(role: "creator" | "builder") {
    await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
    router.push("/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ProjectMatch</Text>
        <Text style={styles.subtitle}>
          Criadores transformam ideias em projetos.
          {"\n"}
          Builders transformam projetos em realidade.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleStart("creator")}
          >
            <Text style={styles.primaryButtonText}>Quero criar um projeto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleStart("builder")}
          >
            <Text style={styles.secondaryButtonText}>
              Quero participar de projetos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Já possui conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    gap: 16,
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#121a33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#c7d2fe",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  loginButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    color: "#c7d2fe",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
