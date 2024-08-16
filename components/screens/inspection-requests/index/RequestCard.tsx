import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { InspectionRequest } from "@/data/types/InspectionRequest";
import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

type cardProps = {
  inspectionRequest: InspectionRequest | undefined;
};

const RequestCard = ({ inspectionRequest }: cardProps) => {
  return (
    <ThemedView
      darkColor={Colors.dark.lighterBackground}
      style={{
        elevation: 40,
        marginBottom: 12,
        padding: 20,
        borderRadius: 4,
        // shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <ThemedText
          numberOfLines={2}
          style={{ fontWeight: 700, flexShrink: 1, flexGrow: 1, flex: 1 }}
        >
          {inspectionRequest?.name ??
            "A super extreme extra special long long name"}
        </ThemedText>
        {inspectionRequest?.status === "pending" ? (
          <>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 100,
                marginLeft: 16,
                marginRight: 8,
              }}
            >
              <ThemedText style={{ color: "#e00000" }}>Decline</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#5fe17c",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 100,
                shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 20,
              }}
            >
              <Text>Approve</Text>
            </TouchableOpacity>
          </>
        ) : inspectionRequest?.status === "approved" ? (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#5fe17c",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 100,
                shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 20,
              }}
            >
              <Text>APPROVE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      <View style={{ marginTop: 8}}>
        {/* <View> */}
          <ThemedText style={{ fontSize: 12 }}>
            Production series: {inspectionRequest?.productionSeriesCode}
          </ThemedText>
          <ThemedText style={{ fontSize: 12 }}>
            Production plan: {inspectionRequest?.productionPlanCode}
          </ThemedText>
          {/* </View>
        <View style={{ alignItems: "flex-end" }}> */}
          <ThemedText style={{ fontSize: 12 }}>
            Creator: {inspectionRequest?.creator}
          </ThemedText>
          <ThemedText style={{ fontSize: 12 }}>
            Created: {inspectionRequest?.created.toLocaleString()}
          </ThemedText>
        {/* </View> */}
      </View>
    </ThemedView>
  );
};

export default RequestCard;
