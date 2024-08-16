import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Text, View } from "react-native";

const Header = () => {

  return (
    <ThemedView
			darkColor={Colors.dark.lighterBackground}
      style={{
        elevation: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        // shadowColor: "#fff",
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 20,
        shadowOpacity: 0.05,
      }}
    >
      <ThemedText>Test</ThemedText>
    </ThemedView>
  );
};

export default Header;
