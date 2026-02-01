import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";

import { ThemedText } from "@/components/ThemedText";
import { AppColors, BorderRadius, Spacing } from "@/constants/theme";

interface AdvancedSettingsProps {
  stepCount: number;
  onStepCountChange: (value: number) => void;
  seed: string;
  onSeedChange: (value: string) => void;
}

export function AdvancedSettings({
  stepCount,
  onStepCountChange,
  seed,
  onSeedChange,
}: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    height.value = withTiming(isExpanded ? 0 : 180, { duration: 300 });
    rotation.value = withTiming(isExpanded ? 0 : 180, { duration: 300 });
  };

  const contentStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpanded} style={styles.header}>
        <ThemedText style={styles.headerText}>Advanced Settings</ThemedText>
        <Animated.View style={iconStyle}>
          <Feather name="chevron-down" size={20} color={AppColors.textSecondary} />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentStyle}>
        <View style={styles.content}>
          <View style={styles.setting}>
            <View style={styles.settingHeader}>
              <ThemedText style={styles.settingLabel}>Steps</ThemedText>
              <ThemedText style={styles.settingValue}>{stepCount}</ThemedText>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={15}
              maximumValue={50}
              step={1}
              value={stepCount}
              onValueChange={onStepCountChange}
              minimumTrackTintColor={AppColors.primary}
              maximumTrackTintColor={AppColors.backgroundElevated}
              thumbTintColor={AppColors.primary}
            />
          </View>

          <View style={styles.setting}>
            <ThemedText style={styles.settingLabel}>Seed (optional)</ThemedText>
            <TextInput
              style={styles.seedInput}
              value={seed}
              onChangeText={onSeedChange}
              placeholder="Random"
              placeholderTextColor={AppColors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.backgroundSurface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: AppColors.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  setting: {
    marginBottom: Spacing.lg,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  settingLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.primary,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  seedInput: {
    backgroundColor: AppColors.backgroundElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: AppColors.textPrimary,
    fontSize: 16,
    marginTop: Spacing.sm,
  },
});
