import { StyleSheet, Text, View } from "react-native";

import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.problem}>{project.problem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#111827",
    padding: 16,
    gap: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  problem: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
});
