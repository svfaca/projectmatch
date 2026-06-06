import {
    BrandMark,
    ModernScreen,
    SurfaceCard,
    palette,
} from "@/components/ui/projectmatch-ui";
import { StyleSheet, Text } from "react-native";

export default function InterestedBuildersScreen() {
  return (
    <ModernScreen contentStyle={styles.container}>
      <BrandMark compact />
      <SurfaceCard style={styles.card}>
        <Text style={styles.title}>Builders interessados</Text>
        <Text style={styles.subtitle}>
          Um painel limpo para ver quem quer participar e avançar a conversa.
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
