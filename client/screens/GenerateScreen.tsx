import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { PreviewCard } from "@/components/PreviewCard";
import { PromptInput } from "@/components/PromptInput";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { GradientButton } from "@/components/GradientButton";
import { ThemedText } from "@/components/ThemedText";
import { AppColors, Spacing } from "@/constants/theme";
import {
  generateImage,
  isLoaded,
  addStepListener,
  getStableDiffusionAvailability,
} from "@/lib/stableDiffusion";
import { saveGeneratedImage, generateId, getSettings } from "@/lib/storage";

export default function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [prompt, setPrompt] = useState("");
  const [stepCount, setStepCount] = useState(25);
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(
    null,
  );
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
    checkModelStatus();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    setStepCount(settings.defaultSteps);
    setIsModelLoaded(settings.isModelLoaded);
  };

  const checkModelStatus = () => {
    setIsModelLoaded(isLoaded());
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      Alert.alert("Empty Prompt", "Please enter a description for your image.");
      return;
    }

    const availability = getStableDiffusionAvailability();
    if (!availability.isAvailable && availability.canUseDemo) {
      // For demo purposes in Expo Go, simulate the generation
      setIsGenerating(true);
      setCurrentStep(0);
      setGeneratedImageUri(null);

      const subscription = addStepListener(({ step }) => {
        setCurrentStep(step);
      });

      try {
        // Simulate generation with a placeholder image
        const imageId = generateId();
        const savePath = `file://generated/${imageId}.jpg`;

        // Simulate steps
        for (let i = 1; i <= stepCount; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setCurrentStep(i);
        }

        // Use a placeholder image for demo
        const demoImageUri = `https://picsum.photos/seed/${imageId}/512/512`;

        setGeneratedImageUri(demoImageUri);

        await saveGeneratedImage({
          id: imageId,
          uri: demoImageUri,
          prompt: prompt.trim(),
          stepCount,
          seed: seed || undefined,
          createdAt: new Date().toISOString(),
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error("Generation error:", error);
        Alert.alert("Error", "Failed to generate image. Please try again.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsGenerating(false);
        subscription.remove();
      }
      return;
    }

    if (!availability.isAvailable) {
      Alert.alert(availability.title, availability.message);
      return;
    }

    // Native implementation
    if (!isModelLoaded) {
      Alert.alert(
        "Model Not Loaded",
        "Please load a Stable Diffusion model in Settings first.",
      );
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setGeneratedImageUri(null);

    const subscription = addStepListener(({ step }) => {
      setCurrentStep(step);
    });

    try {
      const imageId = generateId();
      const savePath = `file://Documents/generated/${imageId}.jpg`;

      await generateImage({
        prompt: prompt.trim(),
        stepCount,
        savePath,
        seed: seed ? parseInt(seed, 10) : undefined,
      });

      setGeneratedImageUri(savePath);

      await saveGeneratedImage({
        id: imageId,
        uri: savePath,
        prompt: prompt.trim(),
        stepCount,
        seed: seed || undefined,
        createdAt: new Date().toISOString(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Generation error:", error);
      Alert.alert("Error", "Failed to generate image. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
      subscription.remove();
    }
  }, [prompt, stepCount, seed, isModelLoaded]);

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.localBadge}>
        <ThemedText style={styles.localBadgeText}>LOCAL</ThemedText>
        <ThemedText style={styles.privateBadgeText}>PRIVATE</ThemedText>
      </View>

      <PreviewCard
        imageUri={generatedImageUri}
        isGenerating={isGenerating}
        currentStep={currentStep}
        totalSteps={stepCount}
        isEmpty={!generatedImageUri && !isGenerating}
      />

      <View style={styles.inputSection}>
        <PromptInput
          value={prompt}
          onChangeText={setPrompt}
          editable={!isGenerating}
        />
      </View>

      <AdvancedSettings
        stepCount={stepCount}
        onStepCountChange={setStepCount}
        seed={seed}
        onSeedChange={setSeed}
      />

      <GradientButton
        onPress={handleGenerate}
        disabled={!canGenerate}
        loading={isGenerating}
        style={styles.generateButton}
        testID="button-generate"
      >
        {isGenerating ? "Generating..." : "Generate"}
      </GradientButton>

      {Platform.OS === "web" && (
        <ThemedText style={styles.webNotice}>
          Run in Expo Go on iOS for full Stable Diffusion support
        </ThemedText>
      )}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  localBadge: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
  },
  localBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: AppColors.primary,
    letterSpacing: 2,
  },
  privateBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: AppColors.secondary,
    letterSpacing: 2,
  },
  inputSection: {
    gap: Spacing.md,
  },
  generateButton: {
    marginTop: Spacing.md,
  },
  webNotice: {
    fontSize: 12,
    color: AppColors.textTertiary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
