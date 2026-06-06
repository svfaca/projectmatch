import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { AppButton } from "./ui/projectmatch-ui";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "ghost";
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
    <AppButton title={title} onPress={onPress} variant={variant} style={style}>
      {children}
    </AppButton>
  );
}
