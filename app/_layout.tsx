import { Stack, Tabs } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen
        name="camera/[id]"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="inspection-results/[id]" />
      <Stack.Screen name="inspection-requests" />
    </Stack>
  );
};

export default RootLayout;
