import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Header = () => {
  const [token, setToken] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const getToken = async () => {
    const oldToken = await AsyncStorage.getItem("token");
    const oldName = await AsyncStorage.getItem("userName");
    if (oldToken) {
      setToken(oldToken);
      setUserName(oldName!);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("userName");
    
    await AsyncStorage.getItem("userName") ?? router.replace("/");
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <ThemedView style={style.header}>
      <ThemedText numberOfLines={1}>{userName}</ThemedText>
      <Pressable onPress={signOut}>
        <Text>Log out</Text>
      </Pressable>
    </ThemedView>
  );
};

export default Header;

const style = StyleSheet.create({
  header: {
    padding: 8
  },
});
