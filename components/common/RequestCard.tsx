import React, { memo, useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  InspectionRequest,
  InspectionRequestListingItem,
} from "@/data/types/InspectionRequest";
import { Colors } from "@/constants/Colors";
import { Href, Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <ThemedView darkColor={Colors.dark.lighterBackground}>
      <View style={style.cardHeader}>
        <ThemedText>{inspectionRequest.name}</ThemedText>
        {requestStatus == "Pending" && (
          <View style={style.cardActionContainer}>
            <Pressable
              onPress={async () => {
                let a = await changeStatus("Declined");
                a && router.replace("/inspection-requests");
              }}
              style={style.cardActionButton}
            >
              <ThemedText>Decline</ThemedText>
            </Pressable>
            <Pressable
              onPress={async () => {
                let a = await changeStatus("Approved");
                a && router.replace("/inspection-requests");
              }}
              style={style.cardActionButton}
            >
              <ThemedText>Approve</ThemedText>
            </Pressable>
          </View>
        )}
        {requestStatus == "Approved" && (
          <Pressable
            onPress={() => {
              router.push({
                pathname: `/camera/[id]`,
                params: {
                  id: inspectionRequest.id,
                  seriesId: inspectionRequest.productionSeriesId,
                  specificationId: inspectionRequest.productSpecificationId,
                },
              });
            }}
            style={style.cardActionButton}
          >
            <ThemedText>Inspect</ThemedText>
          </Pressable>
        )}
        {(requestStatus == "Declined" || requestStatus == "Passed" || requestStatus == "Failed") && (
          <ThemedText>{requestStatus}</ThemedText>
        )}
      </View>
      <View>
        <ThemedText>
          Series: {inspectionRequest.productionSeriesCode}
        </ThemedText>
        <ThemedText>
          CreatedDate: {inspectionRequest.createdDate.toLocaleString()}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default memo(RequestCard);

const style = StyleSheet.create({
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
    backgroundColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
