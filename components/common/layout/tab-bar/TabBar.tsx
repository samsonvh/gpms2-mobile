import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={style.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        return (
          <Pressable key={index} style={style.tabBarItem}>
            {isFocused ? (
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
            )}
            <Text>{label as string}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const style = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    gap: 4,
    elevation: 10,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical:8,
    borderRadius: 6,
  },
});

export default TabBar;
