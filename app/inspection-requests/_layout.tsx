import { Stack, Tabs } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TabBar from "@/components/common/layout/tab-bar/TabBar";

const RequestLayout = () => {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 12,
          right: 12,
          borderRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Inspection requests",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ focused, size }) => {
            return focused ? (
              <MaterialCommunityIcons
                name="clipboard-text-search"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="clipboard-text-search-outline"
                size={24}
                color="black"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarLabel: "Dashboard",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ focused, size }) => {
            return focused ? (
              <MaterialCommunityIcons
                name="desktop-mac-dashboard"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="monitor-dashboard"
                size={24}
                color="black"
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default RequestLayout;
