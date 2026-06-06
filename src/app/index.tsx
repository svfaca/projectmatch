import "../services/firebase";

console.log("Firebase conectado");

import {
  AppButton,
  BrandMark,
  FeatureCard,
  ModernScreen,
  SurfaceCard,
  palette,
} from "@/components/ui/projectmatch-ui";
import { ROLE_STORAGE_KEY } from "@/constants/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  async function handleStart(role: "creator" | "builder") {
    await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
    router.push("/login");
  }

  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.hero}>
        <BrandMark />
        <Text style={styles.title}>Conecte ideias. Construa juntos.</Text>
        <Text style={styles.subtitle}>
          Encontre pessoas incríveis para criar projetos reais.
        </Text>
      </View>

      <SurfaceCard style={styles.illustrationCard}>
        <View style={styles.illustrationBackdrop} />
        <View style={styles.illustrationRow}>
          <View style={[styles.avatar, styles.avatarPrimary]}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={[styles.avatar, styles.avatarNeutral]}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={[styles.avatar, styles.avatarAccent]}>
            <Text style={styles.avatarText}>C</Text>
          </View>
        </View>
        <Text style={styles.illustrationTitle}>
          Uma equipe montada em torno da ideia certa.
        </Text>
        <Text style={styles.illustrationText}>
          Compartilhe, descubra e avance com pessoas que querem construir de
          verdade.
        </Text>
      </SurfaceCard>

      <View style={styles.cards}>
        <FeatureCard
          badge="🚀"
          tone="indigo"
          title="Criar Projeto"
          description="Tenho uma ideia e procuro pessoas para tirar do papel."
          onPress={() => handleStart("creator")}
        />

        <FeatureCard
          badge="👥"
          tone="sky"
          title="Participar de Projetos"
          description="Quero encontrar projetos incríveis para participar."
          onPress={() => handleStart("builder")}
        />
      </View>

      <AppButton
        title="Já possui conta? Entrar"
        variant="secondary"
        onPress={() => router.push("/login")}
        style={styles.loginButton}
        trailingElement={<Text style={styles.chevron}>›</Text>}
      />
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 22,
    paddingTop: 16,
    paddingBottom: 12,
  },
  hero: {
    alignItems: "center",
    gap: 14,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
    marginTop: 6,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320,
  },
  illustrationCard: {
    gap: 14,
    alignItems: "center",
    overflow: "hidden",
  },
  illustrationBackdrop: {
    position: "absolute",
    top: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(99, 102, 241, 0.10)",
  },
  illustrationRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPrimary: {
    backgroundColor: "rgba(99, 102, 241, 0.16)",
  },
  avatarNeutral: {
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    marginBottom: 14,
  },
  avatarAccent: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: "800",
  },
  illustrationTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  illustrationText: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
  },
  cards: {
    gap: 12,
  },
  loginButton: {
    alignSelf: "stretch",
  },
  chevron: {
    color: palette.primary,
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "400",
  },
});
