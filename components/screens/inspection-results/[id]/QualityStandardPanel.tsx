import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { QualityStandardListingItem } from "@/data/types/QualityStandard";

type PanelProps = {
  qualityStandards: QualityStandardListingItem[];
};

const QualityStandardPanel = ({ qualityStandards }: PanelProps) => {
  return (
    <View>
      {qualityStandards.map((qs, index) => (
        <Text key={index}>{qs.name}</Text>
      ))}
    </View>
  );
};

export default QualityStandardPanel;

const styles = StyleSheet.create({});
