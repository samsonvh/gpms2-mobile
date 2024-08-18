import React, { useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { InspectionRequest } from "@/data/types/InspectionRequest";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { Pressable, Text, View } from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Href, router, usePathname } from "expo-router";

type cardProps = {
  inspectionRequest: InspectionRequest;
};

const RequestCard = ({ inspectionRequest }: cardProps) => {
  const pathName = usePathname();

  return (
    <ThemedView
      darkColor={Colors.dark.lighterBackground}
      style={{
        padding: 20,
        elevation: 20,
        shadowRadius: 8,
        shadowOpacity: 0.1,
        shadowOffset: { height: 2, width: 0 },
        borderRadius: 8,
        margin: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <ThemedText
          numberOfLines={1}
          style={{ flexGrow: 1, flexShrink: 1, fontWeight: 600 }}
        >
          {inspectionRequest.name}
        </ThemedText>
        {inspectionRequest.status === "pending" ? (
          <>
            <Pressable
              style={{
                marginLeft: 12,
                marginRight: 4,
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 100,
              }}
            >
              <ThemedText
                style={{
                  color: "#ff3333",
                }}
              >
                Decline
              </ThemedText>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#19c8a6",
                paddingHorizontal: 16,
                paddingVertical: 8,
                shadowRadius: 4,
                shadowOpacity: 0.15,
                shadowOffset: { height: 1, width: 0 },
                borderRadius: 100,
              }}
            >
              <ThemedText>Approve</ThemedText>
            </Pressable>
          </>
        ) : null}
        {inspectionRequest.status === "approved" ? (
          <>
            <Pressable
              onPress={(event) =>
                router.push("/camera" as Href<string>)
              }
              style={{
                backgroundColor: "#00618c",
                marginLeft: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                shadowRadius: 4,
                shadowOpacity: 0.15,
                shadowOffset: { height: 1, width: 0 },
                borderRadius: 100,
              }}
            >
              <ThemedText style={{ color: "#fff" }}>
                Start inspection
              </ThemedText>
            </Pressable>
          </>
        ) : null}
        {inspectionRequest.status === "in progress" ? (
          <>
            <ThemedText
              style={{
                marginLeft: 12,
                flexWrap: "nowrap",
                color: "#00618c",
                fontWeight: 700,
              }}
            >
              {inspectionRequest.status}
            </ThemedText>
          </>
        ) : null}
        {inspectionRequest.status === "declined" ||
        inspectionRequest.status === "canceled" ? (
          <>
            <ThemedText
              style={{
                marginLeft: 12,
                flexWrap: "nowrap",
                color: "#ff3333",
                fontWeight: 700,
              }}
            >
              {inspectionRequest.status}
            </ThemedText>
          </>
        ) : null}
      </View>
      <View>
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
        {inspectionRequest.status === "approved" ||
        inspectionRequest.status === "declined" ? (
          <>
            <ThemedText style={{ fontSize: 12 }}>
              Reviewer: {inspectionRequest.reviewer}
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              Reviewed: {inspectionRequest.reviewed?.toLocaleString()}
            </ThemedText>
          </>
        ) : null}
        {inspectionRequest.status === "in progress" ||
        inspectionRequest.status === "finished" ? (
          <>
            <ThemedText style={{ fontSize: 12 }}>
              Inspector: {inspectionRequest.inspector}
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              Inspected: {inspectionRequest.inspected?.toLocaleString()}
            </ThemedText>
          </>
        ) : null}
      </View>
    </ThemedView>
  );
};

export default RequestCard;
