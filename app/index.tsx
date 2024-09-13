import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Redirect, router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import { Colors } from "@/constants/Colors";

const Index = () => {
  const renderItem = useCallback((item: ListRenderItemInfo<any>) => {
    return <RequestCard key={item.index} inspectionRequest={item.item} />;
  }, []);

  const [email, setEmail] = useState<string>("inspectionmanager@gmail.com");
  const [password, setPassword] = useState<string>("inspectionmanager");
  const router = useRouter();

  const loginHandler = async () => {
    await fetch(`${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/auth/sign-in`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        AsyncStorage.setItem("token", data.accessToken);
        console.log(data.accessToken)
        AsyncStorage.setItem("userName", data.account.fullName);
        AsyncStorage.setItem("userRole", data.account.role);
      })
      .finally(
        async () =>
          (await AsyncStorage.getItem("token")) &&
          router.replace("/inspection-requests")
      )
      .catch((error) => console.log(error));
  };

  const checkedLoggedIn = async () => {
    await AsyncStorage.getItem("token") && router.replace("/inspection-requests");
  }

  useEffect(() => {
    checkedLoggedIn();
  }, [])

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", paddingHorizontal: 40 }}
    >
      <ThemedText>Email:</ThemedText>
      <TextInput
        style={style.textInput}
        inputMode="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />
      <ThemedText>Password:</ThemedText>
      <TextInput
        style={style.textInput}
        inputMode="text"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
      />
      <Pressable onPress={async () => loginHandler()} style={style.button}>
        <ThemedText>Login</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

export default Index;

const style = StyleSheet.create({
  textInput: {
    borderWidth: 1,
  },
  button: {},
});
