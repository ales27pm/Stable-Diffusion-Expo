import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ImageDetailModalRouteProp = RouteProp<RootStackParamList, "ImageDetailModal">;

export default function ImageDetailModal() {
  const route = useRoute<ImageDetailModalRouteProp>();

  return (
    <View style={styles.container}>
      <ThemedText>Image Detail Modal</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
});
