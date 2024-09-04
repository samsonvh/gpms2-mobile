import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  const [token, setToken] = useState<string>();

  const getToken = async () => {
    const oldToken = await AsyncStorage.getItem("token");
    if (oldToken) {
      setToken(oldToken);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <ThemedView darkColor={Colors.dark.lighterBackground} style={style.header}>
      <ThemedText numberOfLines={1}>{token}</ThemedText>
    </ThemedView>
  );
};

export default Header;

const style = StyleSheet.create({
  header: {},
});
