import {
  AppButton,
  AppTextField,
  BrandMark,
  ModernScreen,
  SurfaceCard,
  palette,
} from "@/components/ui/projectmatch-ui";
import { auth } from "@/services/firebase";
import { createProject } from "@/services/projects";
import { getUserProfile } from "@/services/users";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function CreateProjectScreen() {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [skills, setSkills] = useState("");
  const [membersCount, setMembersCount] = useState(1);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Erro", "Usuário não autenticado.");

    const profile = await getUserProfile(user.uid);
    if (profile?.status === "deleted") {
      return Alert.alert("Conta desativada", "Esta conta foi excluída.");
    }

    if (!title.trim()) return Alert.alert("Validação", "Título é obrigatório.");

    setSaving(true);

    try {
      await createProject({
        title: title.trim(),
        problem: problem.trim(),
        description: description.trim(),
        objective: objective.trim(),
        requiredSkills: skills
          ? skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        membersCount,
        ownerId: user.uid,
      });

      router.replace("/creator");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível criar o projeto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <BrandMark compact />
        <Text style={styles.kicker}>Creator</Text>
        <Text style={styles.title}>
          Crie um projeto com uma apresentação clara.
        </Text>
        <Text style={styles.subtitle}>
          Estruture sua ideia para atrair as pessoas certas com confiança.
        </Text>
      </View>

      <SurfaceCard style={styles.card}>
        <AppTextField
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Título do projeto"
        />

        <AppTextField
          label="Problema"
          value={problem}
          onChangeText={setProblem}
          placeholder="Qual problema o projeto resolve?"
        />

        <AppTextField
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição do projeto"
          multiline
        />

        <AppTextField
          label="Objetivo"
          value={objective}
          onChangeText={setObjective}
          placeholder="Objetivo do projeto"
        />

        <AppTextField
          label="Skills desejadas (vírgula)"
          value={skills}
          onChangeText={setSkills}
          placeholder="React, Node, UX"
        />

        <AppTextField
          label="Quantidade de membros"
          value={String(membersCount)}
          onChangeText={(v) => setMembersCount(Number(v) || 1)}
          keyboardType="numeric"
          placeholder="1"
        />

        <AppButton
          title={saving ? "Salvando..." : "Criar projeto"}
          onPress={handleSave}
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
  header: {
    gap: 10,
    paddingTop: 8,
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
  card: {
    gap: 14,
  },
});
