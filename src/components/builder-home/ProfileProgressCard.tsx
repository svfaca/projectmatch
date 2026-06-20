import { Pressable, StyleSheet, Text, View } from "react-native";

type ProfileProgressCardProps = {
  progress: number;
  onPress?: () => void;
};

export function ProfileProgressCard({ progress, onPress }: ProfileProgressCardProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Seu perfil esta {clamped}% completo</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${clamped}%` }]} />
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Completar Perfil</Text>
      </Pressable>
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
  title: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#208AEF",
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: "#208AEF",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.9,
  },
});
