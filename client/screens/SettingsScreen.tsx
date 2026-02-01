import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Switch,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { GradientButton } from "@/components/GradientButton";
import { AppColors, BorderRadius, Spacing } from "@/constants/theme";
import { getSettings, saveSettings, AppSettings } from "@/lib/storage";
import {
  loadModel,
  unloadModel,
  isNativeModuleAvailable,
} from "@/lib/stableDiffusion";

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: SettingRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.settingRowPressed,
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.settingIcon}>
        <Feather name={icon as any} size={20} color={AppColors.primary} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle ? (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        ) : null}
      </View>
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <Feather
          name="chevron-right"
          size={20}
          color={AppColors.textTertiary}
        />
      ) : null}
    </Pressable>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [settings, setSettings] = useState<AppSettings>({
    defaultSteps: 25,
    saveOriginals: true,
    isModelLoaded: false,
  });
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    await saveSettings(updates);
  };

  const handleLoadModel = async () => {
    if (settings.isModelLoaded) {
      // Unload model
      try {
        await unloadModel();
        updateSettings({ isModelLoaded: false });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error("Failed to unload model", error);
        Alert.alert("Error", "Failed to unload model");
      }
    } else {
      // Load model
      if (!isNativeModuleAvailable()) {
        if (__DEV__) {
          Alert.alert(
            "Demo Mode",
            "Stable Diffusion runs only in native iOS builds. Using demo mode in Expo Go.",
          );
        } else {
          Alert.alert(
            "Native Build Required",
            "Loading Stable Diffusion models requires a native iOS build. This feature is not available in Expo Go.\n\nBuild your app with EAS to use this feature.",
            [{ text: "OK" }],
          );
          return;
        }
      }

      setIsModelLoading(true);
      try {
        // In a real implementation, we would use a file picker
        // to let the user select the model directory
        const modelPath = "Documents/Model/stable-diffusion-2-1";
        await loadModel(modelPath);
        updateSettings({ isModelLoaded: true, modelPath });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error("Failed to load model", error);
        Alert.alert("Error", "Failed to load model");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsModelLoading(false);
      }
    }
  };

  const handleOpenGitHub = async () => {
    const url = "https://github.com/andrei-zgirvaci/expo-stable-diffusion";
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  const handleOpenDocs = async () => {
    const url = "https://huggingface.co/apple/coreml-stable-diffusion-2-1-base";
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  };

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
      <SettingSection title="Profile">
        <View style={styles.profileRow}>
          <Image
            source={require("../../assets/images/avatar-default.png")}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>Artist</ThemedText>
            <ThemedText style={styles.profileSubtitle}>Local Device</ThemedText>
          </View>
        </View>
      </SettingSection>

      <SettingSection title="Model">
        <View style={styles.modelCard}>
          <View style={styles.modelHeader}>
            <Image
              source={
                settings.isModelLoaded
                  ? require("../../assets/images/model-ready.png")
                  : require("../../assets/images/icon.png")
              }
              style={styles.modelIcon}
            />
            <View style={styles.modelInfo}>
              <ThemedText style={styles.modelName}>
                Stable Diffusion 2.1
              </ThemedText>
              <ThemedText
                style={[
                  styles.modelStatus,
                  settings.isModelLoaded && styles.modelStatusLoaded,
                ]}
              >
                {settings.isModelLoaded ? "Loaded" : "Not loaded"}
              </ThemedText>
            </View>
          </View>
          <GradientButton
            onPress={handleLoadModel}
            loading={isModelLoading}
            style={styles.modelButton}
          >
            {settings.isModelLoaded ? "Unload Model" : "Load Model"}
          </GradientButton>
          <ThemedText style={styles.modelHint}>
            Download models from Apple&apos;s Hugging Face repo
          </ThemedText>
        </View>
      </SettingSection>

      <SettingSection title="Generation Defaults">
        <View style={styles.sliderRow}>
          <View style={styles.sliderHeader}>
            <ThemedText style={styles.sliderLabel}>Default Steps</ThemedText>
            <ThemedText style={styles.sliderValue}>
              {settings.defaultSteps}
            </ThemedText>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={50}
            step={1}
            value={settings.defaultSteps}
            onValueChange={(value) => updateSettings({ defaultSteps: value })}
            minimumTrackTintColor={AppColors.primary}
            maximumTrackTintColor={AppColors.backgroundElevated}
            thumbTintColor={AppColors.primary}
          />
        </View>
        <SettingRow
          icon="save"
          title="Save Originals"
          subtitle="Keep high-resolution copies"
          rightElement={
            <Switch
              value={settings.saveOriginals}
              onValueChange={(value) => {
                updateSettings({ saveOriginals: value });
                Haptics.selectionAsync();
              }}
              trackColor={{
                false: AppColors.backgroundElevated,
                true: AppColors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </SettingSection>

      <SettingSection title="About">
        <SettingRow
          icon="github"
          title="GitHub Repository"
          subtitle="expo-stable-diffusion"
          onPress={handleOpenGitHub}
        />
        <SettingRow
          icon="book-open"
          title="Model Documentation"
          subtitle="Apple Core ML Models"
          onPress={handleOpenDocs}
        />
        <SettingRow
          icon="info"
          title="Version"
          rightElement={
            <ThemedText style={styles.versionText}>1.0.0</ThemedText>
          }
        />
      </SettingSection>
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
    gap: Spacing["2xl"],
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginLeft: Spacing.sm,
  },
  sectionContent: {
    backgroundColor: AppColors.backgroundSurface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  profileSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: Spacing.xs,
  },
  modelCard: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  modelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  modelIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  modelStatus: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: Spacing.xs,
  },
  modelStatusLoaded: {
    color: AppColors.success,
  },
  modelButton: {
    marginTop: Spacing.sm,
  },
  modelHint: {
    fontSize: 12,
    color: AppColors.textTertiary,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingRowPressed: {
    backgroundColor: AppColors.backgroundElevated,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: AppColors.backgroundElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  sliderRow: {
    padding: Spacing.lg,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sliderLabel: {
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.primary,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  versionText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
});
