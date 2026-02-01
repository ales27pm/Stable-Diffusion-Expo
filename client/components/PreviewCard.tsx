import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AppColors, BorderRadius, Spacing, Shadows } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PREVIEW_SIZE = SCREEN_WIDTH - Spacing.lg * 2;

interface PreviewCardProps {
  imageUri?: string | null;
  isGenerating?: boolean;
  currentStep?: number;
  totalSteps?: number;
  isEmpty?: boolean;
}

export function PreviewCard({
  imageUri,
  isGenerating = false,
  currentStep = 0,
  totalSteps = 25,
  isEmpty = true,
}: PreviewCardProps) {
  const gradientOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isGenerating) {
      gradientOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      gradientOpacity.value = 0.3;
    }
  }, [isGenerating]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

  const renderContent = () => {
    if (isGenerating) {
      return (
        <View style={styles.generatingContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
            <LinearGradient
              colors={[AppColors.primary, AppColors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </View>
      );
    }

    if (imageUri) {
      return (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../assets/images/empty-generate.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <ThemedText style={styles.emptyText}>
          Enter a prompt to begin
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={[styles.container, Shadows.card]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: BorderRadius["2xl"],
    backgroundColor: AppColors.backgroundSurface,
    overflow: "hidden",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
  },
  generatingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
