import React, { memo } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { InspectionRequest } from "@/data/types/InspectionRequest";
import { Href } from "expo-router";
import { Colors } from "@/constants/Colors";

type cardProps = {
  inspectionRequest: InspectionRequest;
};

const RequestCard = ({ inspectionRequest }: cardProps) => {
  const requestStatus = inspectionRequest.status;

  return (
    <ThemedView
      darkColor={Colors.dark.lighterBackground}
      style={{ padding: 20, elevation: 20, shadowRadius: 4, shadowOpacity: 0.2, borderRadius: 8 }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <ThemedText numberOfLines={1} style={{ flexGrow: 1, flexShrink: 1 }}>
          {inspectionRequest.name}
        </ThemedText>
        {requestStatus === "approved" && (
          <Link
            href={("/camera/" + inspectionRequest.id) as Href}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "#ccc",
              borderRadius: 100,
            }}
          >
            <Text>Start Inspection</Text>
          </Link>
        )}
        {requestStatus === "pending" && (
          <>
            <Pressable
              style={{
                marginLeft: 12,
                marginRight: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <ThemedText>decline</ThemedText>
            </Pressable>
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 100,
              }}
            >
              <ThemedText>approve</ThemedText>
            </Pressable>
          </>
        )}
        {(requestStatus === "declined" ||
          requestStatus === "canceled" ||
          requestStatus === "in progress" ||
          requestStatus === "finished") && (
          <ThemedText>{requestStatus}</ThemedText>
        )}
      </View>
      <View style={{ marginTop: 12 }}>
        <ThemedText style={{ fontSize: 12 }}>
          Production plan: {inspectionRequest.productionPlanCode}
        </ThemedText>
        <ThemedText style={{ fontSize: 12 }}>
          Production series: {inspectionRequest.productionSeriesCode}
        </ThemedText>
        <ThemedText style={{ fontSize: 12 }}>
          Creator: {inspectionRequest.creator}
        </ThemedText>
        <ThemedText style={{ fontSize: 12 }}>
          Created: {inspectionRequest.created.toLocaleString()}
        </ThemedText>
        {requestStatus !== "pending" && requestStatus !== "canceled" && (
          <>
            <ThemedText style={{ fontSize: 12 }}>
              Reviewer: {inspectionRequest.reviewer}
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              Reviewed: {inspectionRequest.reviewed!.toLocaleString()}
            </ThemedText>
          </>
        )}
        {(requestStatus === "finished" || requestStatus === "in progress") && (
          <>
            <ThemedText style={{ fontSize: 12 }}>
              Inspector: {inspectionRequest.inspector}
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              Inspected: {inspectionRequest.inspected!.toLocaleString()}
            </ThemedText>
          </>
        )}
      </View>
    </ThemedView>
  );
};

export default memo(RequestCard);
