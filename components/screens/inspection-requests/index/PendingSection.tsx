import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, FlatList, ScrollView, View } from "react-native";
import RequestCard from "./RequestCard";
import { InspectionRequest } from "@/data/types/InspectionRequest";

type pendingProps = {
  inspectionRequests: InspectionRequest[];
};

const PendingSection = ({ inspectionRequests }: pendingProps) => {
  return (
    <Collapsible title="Pending">
      <ScrollView
        horizontal
        style={{
          maxHeight: 400,
          width: Dimensions.get("screen").width - 40,
          left: -24,
          paddingVertical: 4,
          paddingHorizontal: 16,
        }}
      >
        {inspectionRequests.map((request) =>
          request.status === "pending" ? (
            <View style={{width: 300}}>
              <RequestCard key={request.id} inspectionRequest={request} />
            </View>
          ) : null
        )}
      </ScrollView>
    </Collapsible>
  );
};

export default PendingSection;
