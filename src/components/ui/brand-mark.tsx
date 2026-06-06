import { StyleSheet, Text, View } from "react-native";

const palette = {
  primary: "#6366F1",
  primaryDark: "#5558E6",
  text: "#111827",
};

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, compact && styles.iconCompact]}>
        <Text style={styles.iconText}>PM</Text>
      </View>
      <Text style={[styles.label, compact && styles.labelCompact]}>
        <Text style={styles.labelRegular}>Project</Text>
        <Text style={styles.labelAccent}>Match</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.primaryDark,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 5,
  },
  iconCompact: {
    width: 38,
    height: 38,
    borderRadius: 14,
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: palette.text,
  },
  labelCompact: {
    fontSize: 22,
    lineHeight: 26,
  },
  labelRegular: {
    color: palette.text,
  },
  labelAccent: {
    color: palette.primary,
  },
});
