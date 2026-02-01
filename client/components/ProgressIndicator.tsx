import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { AppColors, BorderRadius, Spacing } from "@/constants/theme";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  message?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  message = "Creating magic...",
}: ProgressIndicatorProps) {
  const pulse = useSharedValue(1);
  const progress = currentStep / totalSteps;

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressContainer, pulseStyle]}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={[AppColors.primary, AppColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <ThemedText style={styles.stepText}>
          Step {currentStep}/{totalSteps}
        </ThemedText>
      </Animated.View>
      <ThemedText style={styles.message}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: AppColors.backgroundElevated,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.primary,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: AppColors.textSecondary,
  },
});
