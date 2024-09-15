import React, { memo, useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Href, Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectionRequestListingItem } from "@/data/types/inspection-request";

type cardProps = {
  inspectionRequest: InspectionRequestListingItem;
};

const RequestCard = ({ inspectionRequest }: cardProps) => {
  const [token, setToken] = useState<string>();
  const router = useRouter();

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) setToken(token);
  };

  useEffect(() => {
    getToken();
  }, []);

  const requestStatus = inspectionRequest.status;
  if (requestStatus == "Approved") {
    console.log(inspectionRequest.id);
  }

  const changeStatus = async (status: string) => {
    let isSucceed = false;

    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/` +
        inspectionRequest.id +
        "?status=" +
        status,
      {
        method: "PATCH",
        headers: {
          authorization: "Bearer " + token,
          "content-type": "application/json",
          accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => (isSucceed = data));

    return isSucceed;
  };

  return (
    <ThemedView style={style.card}>
      <View>
        <ThemedText numberOfLines={1} style={style.title}>
          {inspectionRequest.name}
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 8,
              alignItems: "center",
            }}
          >
            <ThemedText>Required</ThemedText>
            <ThemedText>{inspectionRequest.requiredQuantity}</ThemedText>
          </View>
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 8,
              alignItems: "center",
            }}
          >
            <ThemedText>Failed</ThemedText>
            <ThemedText>{inspectionRequest.failedQuantity}</ThemedText>
          </View>
          <View
            style={{
              borderWidth: 1,
              paddingHorizontal: 8,
              alignItems: "center",
            }}
          >
            <ThemedText>Passed</ThemedText>
            <ThemedText>{inspectionRequest.passedQuantity}</ThemedText>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" , alignItems: "center"}}>
        <ThemedText numberOfLines={1}>{inspectionRequest.createdDate.toString()}</ThemedText>
        {inspectionRequest.status === "Pending" && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable style={style.cardActionButton}>
              <ThemedText style={style.cardActionButtonText}>
                Decline
              </ThemedText>
            </Pressable>
            <Pressable style={style.cardActionButton}>
              <ThemedText style={style.cardActionButtonText}>
                Approve
              </ThemedText>
            </Pressable>
          </View>
        )}
        {(inspectionRequest.status === "Approved" ||
          inspectionRequest.status === "InProgress") && (
          <Pressable
            style={style.cardActionButton}
            onPress={() => {
              router.push(("/camera/" + inspectionRequest.id) as Href);
            }}
          >
            <ThemedText style={style.cardActionButtonText}>Inspect</ThemedText>
          </Pressable>
        )}
        {(inspectionRequest.status === "Declined" ||
          inspectionRequest.status === "Failed") && (
          <ThemedText style={style.statusRedBadge}>
            {inspectionRequest.status}
          </ThemedText>
        )}
        {inspectionRequest.status === "Passed" && (
          <ThemedText style={style.statusGreenBadge}>
            {inspectionRequest.status}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
};

export default memo(RequestCard);

const style = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  title: {
    fontWeight: 700,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardActionButton: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cardActionButtonText: {
    color: "#fff",
    fontWeight: 600,
  },
  statusRedBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: "#eb102f",
    color: "#fff",
    fontWeight: 600,
  },
  statusGreenBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: "#008000",
    color: "#fff",
    fontWeight: 600,
  },
});
