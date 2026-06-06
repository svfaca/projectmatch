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
    title: "🔍 Encontrar Projetos",
    description: "Explorar oportunidades ativas e iniciar conversas.",
    href: "/builder/swipe",
  },
  {
    title: "❤️ Meus Interesses",
    description: "Ver projetos já curtidos e acompanhar próximos passos.",
    href: "/builder/matches",
  },
  {
    title: "💬 Conversas",
    description: "Acessar as trocas em andamento.",
    href: "/builder/matches",
  },
  {
    title: "👤 Perfil",
    description: "Editar dados e preferências do builder.",
    href: "/profile",
  },
];

const projects = [
  {
    title: "OpenCampus",
    description:
      "Aplicativo para mapear oportunidades acadêmicas e conectar estudantes por interesse.",
    creator: "Mariana Costa",
    participants: "18 participantes",
    skills: ["React Native", "Design", "Firebase"],
    tone: "indigo" as const,
  },
  {
    title: "HackSprint",
    description:
      "Espaço para formar squads rápidas e transformar ideias em protótipos úteis.",
    creator: "Bruno Lima",
    participants: "9 participantes",
    skills: ["Product", "API", "UX"],
    tone: "sky" as const,
  },
  {
    title: "JobMatch Uni",
    description:
      "Rede para conectar estudantes a projetos com fit real de skills e interesse.",
    creator: "Patrícia Souza",
    participants: "24 participantes",
    skills: ["Frontend", "Comunicação", "Next"],
    tone: "emerald" as const,
  },
];

export default function BuilderDashboard() {
  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <BrandMark compact />
          <Text style={styles.kicker}>Builder dashboard</Text>
        </View>
        <AppButton
          title="Explorar"
          onPress={() => router.push("/builder/swipe")}
          style={styles.headerButton}
        />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Encontre projetos para construir.</Text>
        <Text style={styles.subtitle}>
          Descubra oportunidades, salve interesses e acompanhe conexões com
          visual de feed moderno.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <DashboardMetric
          value="05"
          label="Novos projetos"
          hint="Nesta semana"
        />
        <DashboardMetric
          value="12"
          label="Curtidos"
          hint="Favoritos salvos"
          tone="sky"
        />
      </View>

      <View style={styles.metricsRow}>
        <DashboardMetric
          value="03"
          label="Matches"
          hint="Prontos para conversar"
          tone="emerald"
        />
        <DashboardMetric
          value="09"
          label="Mensagens"
          hint="Conversas ativas"
          tone="indigo"
        />
      </View>

      <SurfaceCard style={styles.actionCard}>
        <SectionHeader
          title="Atalhos"
          subtitle="Pontos de entrada rápidos para o que você mais usa."
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
          title="Projetos em destaque"
          subtitle="Cards grandes com as informações mais importantes em primeiro plano."
          actionLabel="Ver matches"
          onActionPress={() => router.push("/builder/matches")}
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
    minWidth: 120,
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
