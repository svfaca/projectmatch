import { StyleSheet, Text, View } from "react-native";

const palette = {
  primary: "#6366F1",
  primarySoft: "rgba(99, 102, 241, 0.12)",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
};

type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const active = index + 1 <= currentStep;

        return (
          <View key={step} style={styles.stepBlock}>
            <View style={[styles.stepDot, active && styles.stepDotActive]}>
              <Text
                style={[styles.stepNumber, active && styles.stepNumberActive]}
              >
                {index + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  stepBlock: {
    flex: 1,
    gap: 8,
  },
  stepDot: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  stepNumber: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  stepNumberActive: {
    color: palette.primary,
  },
  stepLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  stepLabelActive: {
    color: palette.text,
  },
});
