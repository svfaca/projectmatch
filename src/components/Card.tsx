import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { SurfaceCard } from "./ui/projectmatch-ui";

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return <SurfaceCard style={style}>{children}</SurfaceCard>;
}
