import { ROLE_STORAGE_KEY } from "@/constants/storage";
import { auth } from "@/services/firebase";
import { getSessionSnapshot } from "@/services/session";
import { getUserProfile, saveOnboardingData } from "@/services/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Role não selecionado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>
          Primeiros passos — {role === "creator" ? "Criador" : "Construtor"}
        </Text>

        <Text style={styles.label}>Universidade</Text>
        <TextInput
          style={styles.input}
          value={university}
          onChangeText={setUniversity}
          placeholder="Universidade"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Curso</Text>
        <TextInput
          style={styles.input}
          value={course}
          onChangeText={setCourse}
          placeholder="Curso"
          placeholderTextColor="#94a3b8"
        />

        {role === "builder" && (
          <>
            <Text style={styles.label}>Skills (separadas por vírgula)</Text>
            <TextInput
              style={styles.input}
              value={skills}
              onChangeText={setSkills}
              placeholder="React, Node, UX"
              placeholderTextColor="#94a3b8"
            />
          </>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Salvando..." : "Continuar"}
          </Text>
        </TouchableOpacity>
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
    gap: 12,
    borderRadius: 18,
    padding: 20,
    backgroundColor: "#0f1724",
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  label: {
    color: "#cbd5e1",
    marginTop: 8,
  },
  input: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#fff",
  },
  primaryButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
