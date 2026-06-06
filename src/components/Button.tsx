import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary";
  children?: ReactNode;
};

export function Button({
  title,
  onPress,
  style,
  variant = "primary",
  children,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        style,
      ]}
    >
      {children ?? (
        <Text
          style={[styles.text, variant === "secondary" && styles.secondaryText]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#e2e8f0",
  },
});
