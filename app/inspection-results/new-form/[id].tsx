import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { InspectionRequestDetails } from "@/data/types/inspection-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QualityStandardListingItem } from "@/data/types/QualityStandard";
import QualityStandardPanel from "@/components/screens/inspection-results/[id]/QualityStandardPanel";

const InspectionScreen = () => {
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>();
  const [inspectionRequest, setInspectionRequest] =
    useState<InspectionRequestDetails>();
  const [qualityStandards, setQualityStandards] = useState<
    QualityStandardListingItem[]
  >([]);

  const getToken = async () => {
    const currentToken = await AsyncStorage.getItem("token");
    setToken(currentToken!);
  };

  const startInpsection = async (id: string) => {
    const url =
      process.env.EXPO_PUBLIC_API_SERVER +
      "/api/v1/inspection-requests/" +
      id +
      "/inspect";
    await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setInspectionRequest(data));
  };

  const getQualityStandards = async (specificationId: string) => {
    const filter = {
      orderBy: "Name",
      isAscending: true,
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    };

    const url =
      process.env.EXPO_PUBLIC_API_SERVER +
      "/api/v1/specifications/" +
      specificationId +
      "/quality-standards/filter";

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    })
      .then((response) => response.json())
      .then((data) => setQualityStandards(data.data));
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      startInpsection(id as string);
    }
  }, [token]);

  useEffect(() => {
    if (inspectionRequest) {
      getQualityStandards(inspectionRequest.productSpecification?.id!);
    }
  }, [inspectionRequest]);

  return (
    <LinearGradient style={styles.screen} colors={["#FFEEEE", "#DDEFBB"]}>
      <View>
        <View
          style={{
            padding: 16,
            margin: 12,
            gap: 16,
            borderRadius: 4,
            elevation: 10,
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {inspectionRequest?.name}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  backgroundColor: "#6dd5ed",
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>
                  View quality standards
                </Text>
              </Pressable>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>
              Inspected quantity:
            </Text>
            <TextInput
              style={{
                paddingTop: 2,
                paddingBottom: 4,
                paddingHorizontal: 4,
                borderBottomWidth: 1,
              }}
              placeholder="number of inspected products"
            />
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>
              Description:
            </Text>
            <TextInput
              style={{
                paddingTop: 6,
                paddingBottom: 4,
                paddingHorizontal: 4,
                textAlignVertical: "top",
                borderBottomWidth: 1,
              }}
              multiline
              numberOfLines={4}
              placeholder="description"
            />
          </View>
        </View>
        <View
          style={{
            flexGrow: 1,
            padding: 16,
            marginHorizontal: 12,
            marginBottom: 12,
            gap: 16,
            borderRadius: 4,
            elevation: 10,
            backgroundColor: "#fff",
          }}
        ></View>
      </View>
      <View>
        <QualityStandardPanel qualityStandards={qualityStandards} />
      </View>
    </LinearGradient>
  );
};

export default InspectionScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
