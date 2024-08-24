import FaultyProductCard from "@/components/common/FaultyProductCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import FaultyProductForm from "@/components/screens/inspection-results/[id]/FaultyProductForm";

const ResultInputScreen = () => {
  const { id } = useLocalSearchParams();
  const request = inspectionRequests.find((r) => r.id === id);

  const [faultyProducts, setFaultyProducts] = useState([
    {
      productionSeriesId: "series1",
      ordinalNumberInSeries: 1,
      quantity: 1,
      description: "No",
    },
    {
      productionSeriesId: "series1",
      ordinalNumberInSeries: 2,
      quantity: 1,
      description: "No",
    },
  ]);

  const [opacity, setOpacity] = useState(1);
  const [isProductFormOpened, setIsProductFormOpened] = useState(false);

  const closeProductForm = useCallback(() => {
    setOpacity(1);
    setIsProductFormOpened(false);
  }, []);

  const renderProduct = useCallback((item: any) => {
    return (
      <FaultyProductCard
        key={item.item.ordinalNumberInSeries}
        faultyProduct={item.item}
      />
    );
  }, []);

  return (
    <ThemedView
      style={{
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
    >
      <View style={{ flex: 1, opacity }}>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => router.back()}>
            <ThemedText>Cancel</ThemedText>
          </Pressable>
          <View style={{ flexGrow: 1 }} />
          <Pressable style={{}}>
            <ThemedText>Done</ThemedText>
          </Pressable>
        </View>
        <View style={{}}>
          <ThemedText style={{ fontSize: 24, fontWeight: 700 }}>
            {request?.name}
          </ThemedText>
          <ThemedText>
            Production series: {request?.productionSeriesCode}
          </ThemedText>
          <ThemedText>
            Production plan: {request?.productionPlanCode}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText>Required: {request?.required}</ThemedText>
          <ThemedText>Passed: {request?.passed}</ThemedText>
          <ThemedText>Failed: {request?.failed}</ThemedText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 600 }}>
            Faulty products:
          </ThemedText>
          <View style={{ flexGrow: 1 }} />
          <Pressable
            style={{ padding: 20 }}
            onPress={() => {
              setIsProductFormOpened(true);
              setOpacity(0.2);
            }}
          >
            <ThemedText>+ Add</ThemedText>
          </Pressable>
        </View>
        <FlatList data={faultyProducts} renderItem={renderProduct} style={{}} />
      </View>
      <ThemedView
        style={{
          display: isProductFormOpened ? "flex" : "none",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          paddingTop: 80,
          paddingBottom: 60,
          paddingHorizontal: 20,
          backgroundColor: "transparent",
        }}
      >
        <FaultyProductForm closeProductForm={closeProductForm} />
      </ThemedView>
    </ThemedView>
  );
};

export default memo(ResultInputScreen);
