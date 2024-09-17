import React, { memo } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FaultyProduct } from "@/data/types/InspectionResult";
import { Collapsible } from "../Collapsible";
import FaultCard from "./FaultCard";

type cardProps = {
  faultyProduct: FaultyProduct;
  key: any;
  qualityStandards: any;
  productionSteps: any;
};

const FaultyProductCard = ({
  faultyProduct,
  key,
  qualityStandards,
  productionSteps,
}: cardProps) => {
  return (
    <ThemedView key={key} style={style.card}>
      <View style={style.textWithLabelContainer}>
        <Text style={style.label}>Ordinal in series:</Text>
        <Text style={style.text}>{faultyProduct.ordinalNumberInSeries}</Text>
      </View>
      <View>
        <Text style={style.label}>Description:</Text>
        <ScrollView style={{ height: 100, paddingHorizontal: 8, marginTop: 4 }}>
          <Text style={{ fontSize: 16, lineHeight: 20 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            tempor leo metus, tincidunt blandit arcu sagittis id. Phasellus ac
            finibus leo. Ut est ante, consequat a orci fringilla, accumsan
            tincidunt felis. Nunc turpis metus, tristique ornare ullamcorper ac,
            porta quis eros. In eleifend bibendum tincidunt. Curabitur non
            turpis id neque posuere ultricies eu quis ligula. Duis at sodales
            lacus, eget ornare lectus. Vestibulum molestie, magna at convallis
            laoreet, odio turpis aliquam mauris, vitae mollis dolor dolor dictum
            velit. Fusce mattis sed orci sed vehicula.
          </Text>
        </ScrollView>
      </View>
      <Collapsible title="Faults:">
        {faultyProduct.productFaults.map((fault, index) => (
          <FaultCard qualityStandards={qualityStandards} productionSteps={productionSteps} key={index} fault={fault} />
        ))}
      </Collapsible>
    </ThemedView>
  );
};

const style = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    margin: 8,
    gap: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 10,
  },
  textWithLabelContainer: {
    flexDirection: "row",
    gap: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    fontSize: 18,
  },
});

export default memo(FaultyProductCard);
