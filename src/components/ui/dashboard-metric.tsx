import { StyleSheet, Text, View } from "react-native";

const palette = {
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  primary: "#6366F1",
  primarySoft: "rgba(99, 102, 241, 0.10)",
  skySoft: "rgba(14, 165, 233, 0.10)",
  emeraldSoft: "rgba(16, 185, 129, 0.10)",
};

type DashboardMetricProps = {
  value: string;
  label: string;
  hint?: string;
  tone?: "primary" | "sky" | "emerald";
};

export function DashboardMetric({
  value,
  label,
  hint,
  tone = "primary",
}: DashboardMetricProps) {
  return (
    <View style={[styles.card, toneStyles[tone]]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const toneStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primarySoft,
  },
  sky: {
    backgroundColor: palette.skySoft,
  },
  emerald: {
    backgroundColor: palette.emeraldSoft,
  },
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    justifyContent: "space-between",
  },
  value: {
    color: palette.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  hint: {
    color: palette.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
