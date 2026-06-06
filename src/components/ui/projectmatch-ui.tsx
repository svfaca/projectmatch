import { ReactNode } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

import { AppScreen } from "./app-screen";
import { BrandMark } from "./brand-mark";
import { DashboardMetric } from "./dashboard-metric";
import { FormField } from "./form-field";
import { StepIndicator } from "./step-indicator";

export const palette = {
  background: "#F8F9FC",
  surface: "#FFFFFF",
  primary: "#6366F1",
  primaryHover: "#5558E6",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  softPrimary: "#EEF2FF",
  softAccent: "#E0E7FF",
} as const;

export { FormField as AppTextField, BrandMark, DashboardMetric, AppScreen as ModernScreen, StepIndicator };

type FeatureCardProps = {
  title: string;
  description: string;
  badge: string;
  tone?: "indigo" | "sky";
  onPress?: () => void;
};

export function FeatureCard({
  title,
  description,
  badge,
  tone = "indigo",
  onPress,
}: FeatureCardProps) {
  return (
    <SurfaceCard pressable onPress={onPress} style={styles.featureCard}>
      <View style={styles.featureRow}>
        <View style={[styles.featureBadge, toneStyles[tone].badge]}>
          <Text style={styles.featureBadgeText}>{badge}</Text>
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </View>
        <Text style={styles.featureArrow}>›</Text>
      </View>
    </SurfaceCard>
  );
}

type SurfaceCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressable?: boolean;
  onPress?: () => void;
};

export function SurfaceCard({
  children,
  style,
  pressable,
  onPress,
}: SurfaceCardProps) {
  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  style?: StyleProp<ViewStyle>;
  leadingElement?: ReactNode;
  trailingElement?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
  leadingElement,
  trailingElement,
  disabled,
  children,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {leadingElement}
      {children ?? (
        <Text
          style={[
            styles.buttonText,
            variant === "primary" && styles.buttonTextPrimary,
            variant === "secondary" && styles.buttonTextSecondary,
            variant === "ghost" && styles.buttonTextGhost,
          ]}
        >
          {title}
        </Text>
      )}
      {trailingElement}
    </Pressable>
  );
}

type ProjectCardViewProps = {
  title: string;
  description: string;
  creator: string;
  participants: string;
  skills: string[];
  subtitle?: string;
  tone?: "indigo" | "sky" | "emerald";
};

export function ProjectCardView({
  title,
  description,
  creator,
  participants,
  skills,
  subtitle,
  tone = "indigo",
}: ProjectCardViewProps) {
  return (
    <SurfaceCard style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.projectHeaderText}>
          <Text style={styles.projectTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.projectSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={[styles.projectPill, toneStyles[tone].pill]}>
          <Text style={styles.projectPillText}>{participants}</Text>
        </View>
      </View>

      <Text style={styles.projectDescription}>{description}</Text>

      <View style={styles.projectMetaRow}>
        <Text style={styles.projectMetaLabel}>Criador</Text>
        <Text style={styles.projectMetaValue}>{creator}</Text>
      </View>

      <View style={styles.skillRow}>
        {skills.map((skill) => (
          <View key={skill} style={[styles.skillChip, toneStyles[tone].chip]}>
            <Text style={styles.skillChipText}>{skill}</Text>
          </View>
        ))}
      </View>
    </SurfaceCard>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onActionPress}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const toneStyles = {
  indigo: {
    badge: { backgroundColor: "#EEF2FF" },
    pill: { backgroundColor: "#EEF2FF" },
    chip: { backgroundColor: "#EEF2FF" },
  },
  sky: {
    badge: { backgroundColor: "#E0F2FE" },
    pill: { backgroundColor: "#E0F2FE" },
    chip: { backgroundColor: "#E0F2FE" },
  },
  emerald: {
    badge: { backgroundColor: "#D1FAE5" },
    pill: { backgroundColor: "#D1FAE5" },
    chip: { backgroundColor: "#D1FAE5" },
  },
} as const;

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.995 }],
    opacity: 0.98,
  },
  button: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: palette.primary,
  },
  buttonSecondary: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
  },
  buttonTextSecondary: {
    color: palette.textPrimary,
  },
  buttonTextGhost: {
    color: palette.primary,
  },
  projectCard: {
    gap: 14,
  },
  featureCard: {
    padding: 0,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  featureBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  featureBadgeText: {
    color: palette.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  featureDescription: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  featureArrow: {
    color: palette.primary,
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "400",
    marginTop: -4,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  projectHeaderText: {
    flex: 1,
    gap: 6,
  },
  projectTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  projectSubtitle: {
    color: palette.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  projectPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  projectPillText: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  projectDescription: {
    color: palette.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  projectMetaRow: {
    gap: 4,
  },
  projectMetaLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  projectMetaValue: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skillChipText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionHeaderText: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    color: palette.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionAction: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});
