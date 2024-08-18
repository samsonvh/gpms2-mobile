import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, View } from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import Header from "@/components/common/layout/header/Header";

const Index = () => {
  const renderItem = useCallback((item: ListRenderItemInfo<any>) => {
    return <RequestCard key={item.index} inspectionRequest={item.item} />;
  }, []);

  return (
    <ThemedView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
      }}
    >
      <Header />
      <FlatList
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        data={inspectionRequests}
        renderItem={renderItem}
        windowSize={5}
      />
    </ThemedView>
  );
};

export default Index;
