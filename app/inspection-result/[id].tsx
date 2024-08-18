import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const ResultInputScreen = () => {
  const { id } = useLocalSearchParams();

  return <ThemedView></ThemedView>;
};

export default ResultInputScreen;
