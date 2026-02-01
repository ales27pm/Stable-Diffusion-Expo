import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GenerateScreen from "@/screens/GenerateScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type GenerateStackParamList = {
  Generate: undefined;
};

const Stack = createNativeStackNavigator<GenerateStackParamList>();

export default function GenerateStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Generate"
        component={GenerateScreen}
        options={{
          headerTitle: () => <HeaderTitle title="AI Art Studio" />,
        }}
      />
    </Stack.Navigator>
  );
}
