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
import { loginHandler } from "@/data/handlers/authentication";

const Index = () => {
  const renderItem = useCallback((item: ListRenderItemInfo<any>) => {
    return <RequestCard key={item.index} inspectionRequest={item.item} />;
  }, []);

  const [email, setEmail] = useState<string>("staffinspection@gmail.com");
  const [password, setPassword] = useState<string>("staff");
  const router = useRouter();

  const checkedLoggedIn = async () => {
    if (await loginHandler({ email, password })) {
      router.replace("/inspection-requests");
    } else {
      console.log("two");
    }
  };

  return (
    <ThemedView style={style.screen}>
      <ThemedView style={style.logoContainer}></ThemedView>
      <ThemedView style={style.form}>
        <View>
          <ThemedText style={style.formTitle}>
            Inspection Mobile Application
          </ThemedText>
          <ThemedText style={style.formDescription}>
            Welcome, please authenticate as an Inspection Staff!
          </ThemedText>
        </View>
        <View>
          <ThemedText style={style.label}>Email:</ThemedText>
          <TextInput
            style={style.textInput}
            inputMode="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View>
          <ThemedText style={style.label}>Password:</ThemedText>
          <TextInput
            style={style.textInput}
            inputMode="text"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable onPress={checkedLoggedIn} style={style.button}>
          <ThemedText style={style.textButton}>Sign in</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default Index;

const style = StyleSheet.create({
  screen: {
    height: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logoContainer: {},
  form: {
    gap: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
  formDescription: {
    fontSize: 14,
    fontWeight: 600
  },
  label: { fontWeight: 600, fontSize: 16, marginBottom: 4 },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 8,
  },
  button: {
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 8,
    elevation: 10,
    backgroundColor: "#fff",
  },
  textButton: {
    fontWeight: 600,
    fontSize: 18,
  },
});
