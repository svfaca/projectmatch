import { ROLE_STORAGE_KEY } from "@/constants/storage";
import { auth } from "@/services/firebase";
import {
    getUserProfile,
    markUserAsDeleted,
    updateUserProfile,
} from "@/services/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    signOut as firebaseSignOut,
    updateEmail,
    updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    getUserProfile(user.uid)
      .then((profile) => {
        if (!active) {
          return;
        }

        setName(profile?.name ?? user.displayName ?? "");
        setEmail(profile?.email ?? user.email ?? "");
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, [user?.uid]);

  async function handleSaveProfile() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      if (trimmedName) {
        await updateProfile(user, { displayName: trimmedName });
      }

      if (trimmedEmail && trimmedEmail !== user.email) {
        await updateEmail(user, trimmedEmail);
      }

      await updateUserProfile(user.uid, {
        name: trimmedName || user.displayName || "Usuário",
        email: trimmedEmail || user.email || "",
      });

      setEditing(false);
      Alert.alert("Perfil atualizado", "As alterações foram salvas.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
      await firebaseSignOut(auth);
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  async function handleDeleteAccount() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const uid = user.uid;

    try {
      await markUserAsDeleted(uid);
      await firebaseSignOut(auth);
      await AsyncStorage.clear();
      router.replace("/");
    } catch (error) {
      console.error("DELETE ACCOUNT", error);
      Alert.alert("Erro", "Não foi possível excluir a conta no momento.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>👤 Meu Perfil</Text>
      <Text style={styles.title}>Minha conta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#94a3b8"
          />
        ) : (
          <Text style={styles.value}>
            {name || user?.displayName || "Usuário"}
          </Text>
        )}

        <Text style={styles.label}>Email</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email@exemplo.com"
            placeholderTextColor="#94a3b8"
          />
        ) : (
          <Text style={styles.value}>
            {email || user?.email || "Sem email"}
          </Text>
        )}
      </View>

      <Pressable
        onPress={() => setEditing((current) => !current)}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.actionText}>
          {editing ? "Cancelar edição" : "✏️ Editar Perfil"}
        </Text>
      </Pressable>

      {editing && (
        <Pressable
          onPress={handleSaveProfile}
          style={({ pressed }) => [
            styles.actionButtonPrimary,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.actionTextPrimary}>Salvar alterações</Text>
        </Pressable>
      )}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.actionText}>🚪 Sair</Text>
      </Pressable>

      <Pressable
        onPress={handleDeleteAccount}
        style={({ pressed }) => [
          styles.dangerButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.dangerText}>🗑️ Excluir Conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    padding: 24,
    paddingTop: 56,
    gap: 12,
  },
  kicker: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  card: {
    marginTop: 10,
    gap: 10,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#121a33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    marginTop: -2,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#fff",
  },
  actionButton: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  actionButtonPrimary: {
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionText: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  actionTextPrimary: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  dangerButton: {
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.14)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
  },
  dangerText: {
    color: "#fecaca",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
