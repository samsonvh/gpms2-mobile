import { Link } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import RequestCard from "@/components/common/RequestCard";

const Index = () => {
  const renderItem = useCallback(
    ({ item }: any) => <Text>{item.item.name}</Text>,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flexGrow: 1 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        data={inspectionRequests}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Index;
