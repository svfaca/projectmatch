import {
    AppButton,
    BrandMark,
    DashboardMetric,
    ModernScreen,
    ProjectCardView,
    SectionHeader,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
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

const projects = [
  {
    title: "StudyFlow",
    description:
      "Plataforma para organizar grupos, tarefas e prazos de projetos acadêmicos.",
    creator: "Você",
    participants: "12 interessados",
    skills: ["React Native", "Product", "UI"],
    tone: "indigo" as const,
  },
  {
    title: "Campus Connect",
    description:
      "Rede para conectar estudantes com ideias complementares dentro da universidade.",
    creator: "Você",
    participants: "7 interessados",
    skills: ["Node", "Firebase", "Design"],
    tone: "sky" as const,
  },
];

export default function CreatorDashboard() {
  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <BrandMark compact />
          <Text style={styles.kicker}>Creator dashboard</Text>
        </View>
        <AppButton
          title="Novo projeto"
          onPress={() => router.push("/creator/create-project")}
          style={styles.headerButton}
        />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>
          Olá, criador. Vamos organizar sua ideia?
        </Text>
        <Text style={styles.subtitle}>
          Acompanhe o progresso, publique projetos e veja quem demonstrou
          interesse.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <DashboardMetric
          value="03"
          label="Projetos ativos"
          hint="Publicados agora"
        />
        <DashboardMetric
          value="14"
          label="Interessados"
          hint="Últimos 7 dias"
          tone="sky"
        />
      </View>

      <View style={styles.metricsRow}>
        <DashboardMetric
          value="08"
          label="Mensagens"
          hint="Novas conversas"
          tone="emerald"
        />
        <DashboardMetric
          value="02"
          label="Novos matches"
          hint="Prontos para avançar"
          tone="indigo"
        />
      </View>

      <SurfaceCard style={styles.actionCard}>
        <SectionHeader
          title="Ações rápidas"
          subtitle="Atalhos para os pontos mais usados do dia a dia."
        />

        <View style={styles.quickActionList}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              onPress={() => router.push(action.href as any)}
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.quickActionPressed,
              ]}
            >
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDescription}>
                {action.description}
              </Text>
            </Pressable>
          ))}
        </View>
      </SurfaceCard>

      <View style={styles.sectionSpacing}>
        <SectionHeader
          title="Seus projetos"
          subtitle="Cartões visuais com o status do que você está construindo."
        />

        <View style={styles.projectList}>
          {projects.map((project) => (
            <ProjectCardView
              key={project.title}
              title={project.title}
              description={project.description}
              creator={project.creator}
              participants={project.participants}
              skills={project.skills}
              tone={project.tone}
            />
          ))}
        </View>
      </View>
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  headerButton: {
    minWidth: 136,
  },
  hero: {
    gap: 10,
  },
  kicker: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    gap: 16,
  },
  quickActionList: {
    gap: 10,
  },
  quickAction: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    padding: 16,
    gap: 4,
  },
  quickActionPressed: {
    opacity: 0.92,
  },
  quickActionTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  quickActionDescription: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionSpacing: {
    gap: 14,
  },
  projectList: {
    gap: 12,
  },
});
