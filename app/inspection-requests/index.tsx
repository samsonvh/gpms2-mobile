import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import Header from "@/components/common/layout/header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectionRequestListingItem } from "@/data/types/InspectionRequest";

const Index = () => {
  const [token, setToken] = useState<string>();
  const [requests, setRequests] = useState<InspectionRequestListingItem[]>();

  const renderItem = useCallback(
    (item: ListRenderItemInfo<InspectionRequestListingItem>) => {
      return <RequestCard key={item.index} inspectionRequest={item.item} />;
    },
    []
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) setToken(token);
  };

  const getRequests = async () => {
    await fetch(`${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/filter`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    })
      .then((request) => {console.log(request); return request.json()})
      .then((data) => {
        setRequests(data.data);
        console.log(data.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getToken();
    getRequests();
  }, []);

  return (
    <ThemedView>
      <Header />
      <FlatList
        style={style.list}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        data={requests}
        renderItem={renderItem}
        windowSize={5}
      />
    </ThemedView>
  );
};

export default Index;

const style = StyleSheet.create({
  header: {},
  list: {},
});
