import {
    AppButton,
    BrandMark,
    ModernScreen,
    ProjectCardView,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import { StyleSheet, Text, View } from "react-native";

const projects = [
  {
    title: "CodeBuddy",
    description:
      "Rede para formar duplas de desenvolvimento e acelerar projetos experimentais.",
    creator: "Lucas Ferreira",
    participants: "15 participantes",
    skills: ["React", "Node", "UX"],
    tone: "indigo" as const,
  },
  {
    title: "MVP Lab",
    description:
      "Ambiente para validar ideias, montar squads e publicar versões iniciais com foco.",
    creator: "Fernanda Alves",
    participants: "10 participantes",
    skills: ["Product", "Mobile", "Brand"],
    tone: "sky" as const,
  },
];

export default function SwipeScreen() {
  return (
    <ModernScreen scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <BrandMark compact />
        <View style={styles.headerText}>
          <Text style={styles.kicker}>Builder feed</Text>
          <Text style={styles.title}>
            Deslize e descubra projetos com fit real.
          </Text>
        </View>
      </View>

      <SurfaceCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Hoje há novas oportunidades para entrar em projetos reais.
        </Text>
        <Text style={styles.summaryText}>
          Cards maiores, leitura rápida e informação suficiente para decidir sem
          ruído.
        </Text>
      </SurfaceCard>

      <View style={styles.stack}>
        {projects.map((project, index) => (
          <View
            key={project.title}
            style={[
              styles.stackItem,
              index === 0 && styles.stackTop,
              index === 1 && styles.stackBack,
            ]}
          >
            <ProjectCardView
              title={project.title}
              description={project.description}
              creator={project.creator}
              participants={project.participants}
              skills={project.skills}
              tone={project.tone}
            />
          </View>
        ))}
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Pular"
          variant="secondary"
          style={styles.actionButton}
        />
        <AppButton title="Tenho interesse" style={styles.actionButton} />
      </View>
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 14,
  },
  headerText: {
    gap: 6,
  },
  kicker: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  summaryCard: {
    gap: 8,
  },
  summaryTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  summaryText: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  stack: {
    paddingTop: 8,
  },
  stackItem: {
    marginBottom: 12,
  },
  stackTop: {
    transform: [{ translateY: 0 }],
  },
  stackBack: {
    marginTop: -2,
    opacity: 0.92,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
});
