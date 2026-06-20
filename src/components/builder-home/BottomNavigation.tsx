import { Pressable, StyleSheet, Text, View } from "react-native";

type NavItem = {
  key: string;
  icon: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

type BottomNavigationProps = {
  items: NavItem[];
};

export function BottomNavigation({ items }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={item.onPress}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          <Text style={[styles.icon, item.active && styles.activeText]}>{item.icon}</Text>
          <Text style={[styles.label, item.active && styles.activeText]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 2,
  },
  icon: {
    color: "#9CA3AF",
    fontSize: 18,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "700",
  },
  activeText: {
    color: "#208AEF",
  },
  pressed: {
    opacity: 0.9,
  },
});
