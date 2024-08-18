import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
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

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", paddingHorizontal: 40 }}
    >
      <ThemedView
        darkColor={Colors.dark.lighterBackground}
        style={{ padding: 40, borderRadius: 8 }}
      >
        <View>
          <ThemedText>Username:</ThemedText>
          <TextInput
            style={{
              marginTop: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: "#fff",
              color: "#fff",
            }}
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <ThemedText>Password:</ThemedText>
          <TextInput
            style={{
              marginTop: 8,
              marginBottom: 16,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: "#fff",
              color: "#fff",
            }}
            textContentType="newPassword"
          />
        </View>
        <Pressable
          onPress={() => router.replace("/inspection-requests")}
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, borderRadius: 8 }}>
            Login
          </Text>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default Index;
