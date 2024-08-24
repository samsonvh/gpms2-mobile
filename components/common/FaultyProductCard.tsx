import React, { memo } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Pressable, View } from "react-native";

type cardProps = {
  faultyProduct: any;
};

const FaultyProductCard = ({ faultyProduct }: cardProps) => {
  return (
    <ThemedView style={{padding: 8}}>
      <View style={{flexDirection: "row"}}>
        <ThemedText style={{flexGrow: 1}}>
          Ordinal number in series: {faultyProduct.ordinalNumberInSeries}
        </ThemedText>
        <Pressable>
          <ThemedText>Details</ThemedText>
        </Pressable>
      </View>
      <ThemedText>Description:</ThemedText>
      <ThemedText numberOfLines={2}>{faultyProduct.description}</ThemedText>
    </ThemedView>
  );
};

export default memo(FaultyProductCard);
