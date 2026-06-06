import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const quickActions = [
  {
    title: "➕ Criar Projeto",
    description:
      "Iniciar um novo projeto quando quiser, sem ser a primeira tela.",
    href: "/creator/create-project",
  },
  {
    title: "📋 Meus Projetos",
    description:
      "Acompanhar o que você já publicou e gerenciar o que está ativo.",
    href: "/creator/project-details",
  },
  {
    title: "❤️ Interessados",
    description: "Ver builders que demonstraram interesse nos seus projetos.",
    href: "/creator/interested-builders",
  },
  {
    title: "👤 Perfil",
    description: "Editar seu perfil e dados da conta.",
    href: "/profile",
  },
];

export default function CreatorDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Creator Dashboard</Text>
        <Text style={styles.title}>Organize sua ideia e seus projetos</Text>
        <Text style={styles.subtitle}>
          Use esta tela como ponto de partida para criar, acompanhar e evoluir
          seus projetos.
        </Text>
      </View>

      <View style={styles.grid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => router.push(action.href as any)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardDescription}>{action.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    padding: 24,
    gap: 24,
  },
  hero: {
    marginTop: 36,
    gap: 10,
  },
  kicker: {
    color: "#f9a8d4",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 520,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#121a33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  cardDescription: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
});
