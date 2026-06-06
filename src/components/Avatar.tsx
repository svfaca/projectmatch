import { Image, StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  name: string;
  photoUrl?: string;
  size?: number;
};

export function Avatar({ name, photoUrl, size = 48 }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#1f2937",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#334155",
  },
  initials: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
