import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  name: string;
  onAvatarPress?: () => void;
};

export function Header({ name, onAvatarPress }: HeaderProps) {
  const firstName = name.trim().split(" ")[0] || "Builder";
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "B";

  return (
    <View style={styles.container}>
      <View style={styles.copyColumn}>
        <Text style={styles.greeting}>Ola, {firstName} 👋</Text>
        <Text style={styles.subtitle}>Vamos encontrar seu proximo projeto?</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAvatarPress}
        style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  copyColumn: {
    flex: 1,
    gap: 6,
  },
  greeting: {
    color: "#111827",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  avatarButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#208AEF",
    fontSize: 16,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.9,
  },
});
