import { Pressable, StyleSheet, Text } from "react-native";

type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelected: {
    borderColor: "#208AEF",
    backgroundColor: "#E8F3FE",
  },
  chipPressed: {
    opacity: 0.92,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
  },
  labelSelected: {
    color: "#208AEF",
  },
});
