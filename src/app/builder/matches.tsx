import {
    BrandMark,
    ModernScreen,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import { StyleSheet, Text } from "react-native";

export default function MatchesScreen() {
  return (
    <ModernScreen contentStyle={styles.container}>
      <BrandMark compact />
      <SurfaceCard style={styles.card}>
        <Text style={styles.title}>
          Seus matches estão prontos para continuar a conversa.
        </Text>
        <Text style={styles.subtitle}>
          Aqui o builder vê os projetos curtidos e o que já está em andamento.
        </Text>
      </SurfaceCard>
    </ModernScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 18,
  },
  card: {
    gap: 8,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
