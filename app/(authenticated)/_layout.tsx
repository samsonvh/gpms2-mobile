import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, "lighterBackground");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 40,
          borderRadius: 8,
          elevation: 20,
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          backgroundColor
        },
      }}
    >
      <Tabs.Screen name="inspection-requests" />
    </Tabs>
  );
}
