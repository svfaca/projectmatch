import { ReactNode } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
  background: "#F8F9FC",
  primary: "#6366F1",
  primarySoft: "rgba(99, 102, 241, 0.10)",
  surface: "#FFFFFF",
};

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, "contentContainerStyle" | "children">;
};

export function AppScreen({
  children,
  scroll = false,
  contentStyle,
  scrollProps,
}: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />
      </View>

      {scroll ? (
        <ScrollView
          {...scrollProps}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  topGlow: {
    position: "absolute",
    right: -100,
    top: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: palette.primarySoft,
  },
  bottomGlow: {
    position: "absolute",
    left: -90,
    bottom: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(14, 165, 233, 0.08)",
  },
});
