import React, { memo, useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Href, Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectionRequestListingItem } from "@/data/types/inspection-request";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AccordionItem } from "./Accordion";
import AntDesign from "@expo/vector-icons/AntDesign";

type cardProps = {
  inspectionRequest: InspectionRequestListingItem;
};

const RequestCard = ({ inspectionRequest }: cardProps) => {
  const [token, setToken] = useState<string>();
  const router = useRouter();

  const date = new Date(inspectionRequest.createdDate);

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

  const [open, setOpen] = useState(false);
  const animationHeight = useSharedValue(0); // Initial height of the accordion content

  // Define the animated style for the accordion content
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animationHeight.value, { duration: 300 }), // Smooth transition
      padding: withTiming(open ? 20 : 0, { duration: 300 }), // Smooth transition
      opacity: withTiming(open ? 1 : 0, { duration: 300 }), // Smooth transition
    };
  });

  const toggleAccordion = () => {
    setOpen(!open);
    // Animate the height based on whether the accordion is opened or closed
    animationHeight.value = open ? 0 : 160; // You can set content height dynamically
  };

  return (
    <View
      key={inspectionRequest.id}
      style={{
        elevation: 2,
        marginBottom: 20,
        marginHorizontal: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Pressable onPress={toggleAccordion}>
        <LinearGradient
          colors={
            inspectionRequest.status === "Approved"
              ? ["#56B4D3", "#348F50"]
              : inspectionRequest.status === "Declined" ||
                inspectionRequest.status === "Failed"
              ? ["#ED213A", "#93291E"]
              : inspectionRequest.status === "Passed"
              ? ["#11998e", "#38ef7d"]
              : inspectionRequest.status === "InProgress"
              ? ["#6dd5ed", "#2193b0"]
              : ["#56B4D3", "#348F50"]
          }
          style={{
            padding: 1,
            paddingLeft: 8,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 12,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 7,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 7,
            }}
          >
            <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: "600" }}>
              {inspectionRequest.name}
            </Text>

            {inspectionRequest.status === "Passed" && (
              <AntDesign name="checkcircleo" size={16} color="#11998e" />
            )}
            {inspectionRequest.status === "Failed" && (
              <AntDesign name="closecircleo" size={16} color="#ED213A" />
            )}
            {inspectionRequest.status === "InProgress" && (
              <AntDesign name="clockcircleo" size={16} color="#2193b0" />
            )}
          </View>
        </LinearGradient>
      </Pressable>

      <Animated.View style={[animatedStyle]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>
              Production series:
            </Text>
            <Text>{inspectionRequest.productionSeries.code}</Text>
          </View>
          {inspectionRequest.status === "Approved" && (
            <Pressable
              onPress={() => {
                router.push(("/camera/" + inspectionRequest.id) as Href);
              }}
              style={{
                backgroundColor: "#56B4D3",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Start Inspection
              </Text>
            </Pressable>
          )}
          {inspectionRequest.status === "InProgress" && (
            <Pressable
              onPress={() => {
                router.push(("/camera/" + inspectionRequest.id) as Href);
              }}
              style={{
                backgroundColor: "#56B4D3",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Continue Inspection
              </Text>
            </Pressable>
          )}
          {(inspectionRequest.status === "Declined" ||
            inspectionRequest.status === "Failed") && (
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ED213A" }}>
              {inspectionRequest.status}
            </Text>
          )}
          {inspectionRequest.status === "Passed" && (
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#348F50" }}>
              {inspectionRequest.status}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 16,
          }}
        >
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>Required</Text>
            <Text>{inspectionRequest.requiredQuantity}</Text>
          </View>
          <View style={{ borderWidth: 0.5 }} />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#56B4D3" }}>
              Inspected
            </Text>
            <Text>{inspectionRequest.inspectedQuantity}</Text>
          </View>
          <View style={{ borderWidth: 0.5 }} />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#ED213A" }}>
              Failed
            </Text>
            <Text>{inspectionRequest.failedQuantity}</Text>
          </View>
          <View style={{ borderWidth: 0.5 }} />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#348F50" }}>
              Passed
            </Text>
            <Text>{inspectionRequest.passedQuantity}</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                Created at
              </Text>
              <Text>
                {new Date(inspectionRequest.createdDate).toLocaleDateString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }}>By</Text>
              <Text>{inspectionRequest.creator.name}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );

  // return (
  // <ThemedView style={style.card}>
  //   <View style={style.cardHeader}>
  //     <ThemedText numberOfLines={1} style={style.title}>
  //       {inspectionRequest.name}
  //     </ThemedText>
  //   </View>
  //   <View style={style.cardContent}>
  //     <View style={style.quantityContainer}>
  //       <View style={style.quantityBox}>
  //         <Text style={style.quantityBoxLabel}>Required:</Text>
  //         <Text style={style.quantityNumber}>
  //           {inspectionRequest.requiredQuantity}
  //         </Text>
  //       </View>
  //       <View style={style.quantityBox}>
  //         <Text style={style.quantityBoxLabel}>Failed:</Text>
  //         <Text style={style.quantityNumber}>
  //           {inspectionRequest.failedQuantity}
  //         </Text>
  //       </View>
  //       <View style={style.quantityBox}>
  //         <Text style={style.quantityBoxLabel}>Passed:</Text>
  //         <Text style={style.quantityNumber}>
  //           {inspectionRequest.passedQuantity}
  //         </Text>
  //       </View>
  //     </View>
  //   </View>
  //   <View style={style.cardFooter}>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //       }}
  //     >
  //       <View style={{ flexDirection: "row" }}>
  //         <Text style={style.createdLabel}>Created at </Text>
  //         <Text style={style.createdText}>{date.toLocaleString()}</Text>
  //       </View>
  //       <Pressable
  //         style={style.inspectButton}
  //         onPress={() =>
  //           router.push(("/camera/" + inspectionRequest.id) as Href)
  //         }
  //       >
  //         <Text style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
  //           Inspect
  //         </Text>
  //       </Pressable>
  //     </View>
  //   </View>
  {
    /* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText numberOfLines={1}>
          {inspectionRequest.createdDate.toString()}
        </ThemedText>
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
      </View> */
  }
  // </ThemedView>
  // );
};

export default memo(RequestCard);

const style = StyleSheet.create({
  card: {
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  cardHeader: {},
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  cardContent: {
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  quantityContainer: {
    flexDirection: "row",
    gap: 4,
  },
  quantityBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    elevation: 3,
    gap: 4,
    backgroundColor: "#fff",
    // borderWidth: 1,
  },
  quantityBoxLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardFooter: {
    paddingTop: 8,
  },
  createdLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  createdText: {
    fontSize: 16,
  },
  inspectButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#55b5f1",
    elevation: 10,
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
