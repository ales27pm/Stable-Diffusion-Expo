import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GalleryScreen from "@/screens/GalleryScreen";
import ImageDetailScreen from "@/screens/ImageDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type GalleryStackParamList = {
  Gallery: undefined;
  ImageDetail: { imageId: string };
};

const Stack = createNativeStackNavigator<GalleryStackParamList>();

export default function GalleryStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          headerTitle: "Gallery",
        }}
      />
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}
