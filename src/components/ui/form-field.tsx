import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

const palette = {
  primary: "#6366F1",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  surface: "#FFFFFF",
};

type FormFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
};

export function FormField({ label, helperText, style, onFocus, onBlur, ...props }: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        placeholderTextColor="#94A3B8"
        style={[
          styles.input,
          props.multiline && styles.multiline,
          focused && styles.inputFocused,
          style,
        ]}
      />
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: palette.text,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: palette.primary,
    shadowColor: palette.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  helper: {
    color: palette.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
