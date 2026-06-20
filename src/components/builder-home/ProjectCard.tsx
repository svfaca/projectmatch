import { Pressable, StyleSheet, Text, View } from "react-native";

type ProjectCardProps = {
  title: string;
  institution: string;
  stack: string[];
  applicants: number;
  slots: number;
  onApply?: () => void;
};

export function ProjectCard({
  title,
  institution,
  stack,
  applicants,
  slots,
  onApply,
}: ProjectCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.institution}>{institution}</Text>
      </View>

      <View style={styles.tagsRow}>
        {stack.map((item) => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{applicants} candidatos</Text>
        <Text style={styles.metaText}>{slots} vagas</Text>
      </View>

      {onApply ? (
        <Pressable
          onPress={onApply}
          style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}
        >
          <Text style={styles.applyText}>Candidatar-se</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    gap: 14,
  },
  header: {
    gap: 4,
  },
  title: {
    color: "#111827",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  institution: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  applyButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: "#208AEF",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  applyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.9,
  },
});
