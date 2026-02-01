import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { AppColors, BorderRadius, Spacing, Typography } from "@/constants/theme";

interface PromptInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function PromptInput({
  value,
  onChangeText,
  placeholder = "Describe the image you want to create...",
  editable = true,
}: PromptInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={AppColors.textTertiary}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.backgroundSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.backgroundElevated,
  },
  input: {
    fontSize: Typography.body.fontSize,
    color: AppColors.textPrimary,
    minHeight: 80,
  },
});
