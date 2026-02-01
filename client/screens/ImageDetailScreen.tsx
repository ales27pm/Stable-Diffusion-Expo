import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Share,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";

import { ThemedText } from "@/components/ThemedText";
import { GradientButton } from "@/components/GradientButton";
import { AppColors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { getImageById, deleteGeneratedImage, GeneratedImage } from "@/lib/storage";
import { GalleryStackParamList } from "@/navigation/GalleryStackNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ImageDetailRouteProp = RouteProp<GalleryStackParamList, "ImageDetail">;

export default function ImageDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<ImageDetailRouteProp>();
  const navigation = useNavigation();
  const { imageId } = route.params;

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImage();
  }, [imageId]);

  const loadImage = async () => {
    try {
      const data = await getImageById(imageId);
      setImage(data);
    } catch (error) {
      console.error("Error loading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!image) return;
    
    try {
      await Share.share({
        message: `Check out this AI-generated image!\n\nPrompt: "${image.prompt}"`,
        url: image.uri,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCopyPrompt = async () => {
    if (!image) return;
    
    await Clipboard.setStringAsync(image.prompt);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied", "Prompt copied to clipboard");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGeneratedImage(imageId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting image:", error);
              Alert.alert("Error", "Failed to delete image");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (!image) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ThemedText>Image not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.detailsCard}>
        <ThemedText style={styles.sectionTitle}>Prompt</ThemedText>
        <ThemedText style={styles.promptText}>{image.prompt}</ThemedText>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>Steps</ThemedText>
            <ThemedText style={styles.metaValue}>{image.stepCount}</ThemedText>
          </View>
          {image.seed ? (
            <View style={styles.metaItem}>
              <ThemedText style={styles.metaLabel}>Seed</ThemedText>
              <ThemedText style={styles.metaValue}>{image.seed}</ThemedText>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaLabel}>Created</ThemedText>
            <ThemedText style={styles.metaValue}>
              {formatDate(image.createdAt)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Feather name="share" size={20} color={AppColors.primary} />
          <ThemedText style={styles.actionText}>Share</ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleCopyPrompt}>
          <Feather name="copy" size={20} color={AppColors.primary} />
          <ThemedText style={styles.actionText}>Copy Prompt</ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color={AppColors.error} />
          <ThemedText style={[styles.actionText, { color: AppColors.error }]}>
            Delete
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundPrimary,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  imageContainer: {
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    ...Shadows.card,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  detailsCard: {
    backgroundColor: AppColors.backgroundSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  promptText: {
    fontSize: 16,
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xl,
  },
  metaItem: {},
  metaLabel: {
    fontSize: 12,
    color: AppColors.textTertiary,
    marginBottom: Spacing.xs,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: AppColors.backgroundSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  actionButton: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: 12,
    color: AppColors.primary,
  },
});
