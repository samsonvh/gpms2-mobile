import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

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
      <ThemedText numberOfLines={1} style={style.text}>{userName}</ThemedText>
      <Pressable onPress={signOut} style={style.button}>
        {/* <Text style={style.buttonText}>Log out</Text> */}
        <Entypo name="log-out" size={24} color="black" />
      </Pressable>
    </ThemedView>
  );
};

export default Header;

const style = StyleSheet.create({
  header: {
    flexDirection:"row",
    elevation: 10,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8
  },
  text: {
    fontSize: 18,
    fontWeight: 700
  },
  button: {padding: 4, borderRadius: 4, },
  buttonText:{}
});
