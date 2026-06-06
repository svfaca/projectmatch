import {
    AppButton,
    AppTextField,
    BrandMark,
    ModernScreen,
    StepIndicator,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import { ROLE_STORAGE_KEY } from "@/constants/storage";
import { auth } from "@/services/firebase";
import { getSessionSnapshot } from "@/services/session";
import { getUserProfile, saveOnboardingData } from "@/services/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

type Role = "creator" | "builder";

export default function OnboardingScreen() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ROLE_STORAGE_KEY).then((value) => {
      const v = value === "creator" || value === "builder" ? value : null;
      setRole(v);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || !role) {
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      return;
    }

    let active = true;

    getUserProfile(user.uid)
      .then((profile) => {
        console.log("PROFILE", profile);

        if (!active || !profile) {
          return;
        }

        setUniversity(profile.university ?? "");
        setCourse(profile.course ?? "");
        setSkills(
          Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        );
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, [loading, role]);

  async function handleSubmit() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        university: university || undefined,
        course: course || undefined,
      };

      if (role === "builder") {
        payload.skills = skills
          ? skills
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];
      }

      await saveOnboardingData(user.uid, {
        ...payload,
        role,
        onboardingCompleted: true,
      });

      const session = await getSessionSnapshot(user.uid);
      console.log("SESSION AFTER SAVE", JSON.stringify(session, null, 2));

      router.replace(role === "creator" ? "/creator" : "/builder");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar os dados de onboarding.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ModernScreen contentStyle={styles.loadingState}>
        <ActivityIndicator size="large" color={palette.primary} />
      </ModernScreen>
    );
  }

  if (!role) {
    return (
      <ModernScreen contentStyle={styles.loadingState}>
        <Text style={styles.errorTitle}>Role não selecionado</Text>
      </ModernScreen>
    );
  }

  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <BrandMark compact />
        <Text style={styles.kicker}>Onboarding</Text>
        <Text style={styles.title}>Complete seu perfil em poucos passos.</Text>
        <Text style={styles.subtitle}>
          {role === "creator"
            ? "Organizamos as informações para conectar sua ideia às pessoas certas."
            : "Conte um pouco sobre você para encontrar projetos compatíveis."}
        </Text>
      </View>

      <StepIndicator
        steps={["Perfil", role === "creator" ? "Ideia" : "Skills", "Concluir"]}
        activeStep={1}
      />

      <SurfaceCard style={styles.card}>
        <Text style={styles.cardTitle}>
          Primeiros passos - {role === "creator" ? "Criador" : "Construtor"}
        </Text>

        <AppTextField
          label="Universidade"
          value={university}
          onChangeText={setUniversity}
          placeholder="Universidade"
        />

        <AppTextField
          label="Curso"
          value={course}
          onChangeText={setCourse}
          placeholder="Curso"
        />

        {role === "builder" && (
          <AppTextField
            label="Skills (separadas por vírgula)"
            value={skills}
            onChangeText={setSkills}
            placeholder="React, Node, UX"
          />
        )}

        <AppButton
          title={saving ? "Salvando..." : "Continuar"}
          onPress={handleSubmit}
          disabled={saving}
        />
      </SurfaceCard>
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    gap: 16,
  },
  header: {
    gap: 10,
    paddingTop: 8,
  },
  kicker: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  cardTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
});
