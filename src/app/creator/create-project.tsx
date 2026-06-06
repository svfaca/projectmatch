import { auth } from "@/services/firebase";
import { createProject } from "@/services/projects";
import { getUserProfile } from "@/services/users";
import { router } from "expo-router";
import { useState } from "react";
import {
import { Alert, StyleSheet, Text, View } from "react-native";
} from "react-native";

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.heading}>Criar projeto</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título do projeto"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Problema</Text>
      <TextInput
        style={styles.input}
        value={problem}
        onChangeText={setProblem}
        placeholder="Qual problema o projeto resolve?"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Descrição do projeto"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Objetivo</Text>
      <TextInput
        style={styles.input}
        value={objective}
        onChangeText={setObjective}
        placeholder="Objetivo do projeto"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Skills desejadas (vírgula)</Text>
      <TextInput
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
        placeholder="React, Node, UX"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Quantidade de membros</Text>
      <TextInput
        style={styles.input}
        value={String(membersCount)}
        onChangeText={(v) => setMembersCount(Number(v) || 1)}
        keyboardType="numeric"
        placeholder="1"
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? "Salvando..." : "Criar projeto"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    color: "#cbd5e1",
    marginTop: 10,
  },
  input: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#fff",
  },
  primaryButton: {
    marginTop: 18,
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
