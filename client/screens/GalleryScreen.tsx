import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Image,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { AppColors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { getGeneratedImages, GeneratedImage } from "@/lib/storage";
import { GalleryStackParamList } from "@/navigation/GalleryStackNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const GAP = Spacing.md;
const ITEM_SIZE = (SCREEN_WIDTH - Spacing.lg * 2 - GAP) / NUM_COLUMNS;

type NavigationProp = NativeStackNavigationProp<GalleryStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GalleryItemProps {
  item: GeneratedImage;
  index: number;
  onPress: () => void;
}

function GalleryItem({ item, index, onPress }: GalleryItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.itemContainer,
        index % 2 === 0 ? { marginRight: GAP / 2 } : { marginLeft: GAP / 2 },
        animatedStyle,
      ]}
    >
      <Animated.View
        entering={FadeIn.delay(index * 50).duration(300)}
        style={styles.itemContent}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemOverlay}>
          <ThemedText style={styles.itemPrompt} numberOfLines={2}>
            {item.prompt}
          </ThemedText>
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
}

function EmptyGallery() {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/empty-gallery.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>No images yet</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Generate your first AI artwork in the Generate tab
      </ThemedText>
    </View>
  );
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();

  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadImages = useCallback(async () => {
    try {
      const data = await getGeneratedImages();
      setImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadImages();
    }, [loadImages])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadImages();
    setIsRefreshing(false);
  };

  const handleImagePress = (imageId: string) => {
    Haptics.selectionAsync();
    navigation.navigate("ImageDetail", { imageId });
  };

  const renderItem = ({ item, index }: { item: GeneratedImage; index: number }) => (
    <GalleryItem
      item={item}
      index={index}
      onPress={() => handleImagePress(item.id)}
    />
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
        images.length === 0 && styles.emptyContent,
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      ListEmptyComponent={!isLoading ? <EmptyGallery /> : null}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={AppColors.primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundPrimary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginBottom: GAP,
  },
  itemContent: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: AppColors.backgroundSurface,
    ...Shadows.subtle,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  itemPrompt: {
    fontSize: 12,
    color: AppColors.textPrimary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
  },
});
