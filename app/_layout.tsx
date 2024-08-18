import { Stack, Tabs } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen
        name="camera/[id]"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="inspection-result/[id]" />
      <Stack.Screen name="inspection-requests/index" />
    </Stack>
  );
};

export default RootLayout;
