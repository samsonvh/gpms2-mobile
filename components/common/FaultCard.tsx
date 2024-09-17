import { View, Text, ScrollView } from "react-native";
import React from "react";
import { ProductFault } from "@/data/types/InspectionResult";
import { QualityStandardListingItem } from "@/data/types/QualityStandard";
import { ProductionStepListingItem } from "@/data/types/ProductionStep";

type CardProps = {
  fault: ProductFault;
  qualityStandards: QualityStandardListingItem[];
  productionSteps: ProductionStepListingItem[];
};

const FaultCard = ({ fault, qualityStandards, productionSteps }: CardProps) => {
  return (
    <View>
      <Text>Violated quality standard:</Text>
      <Text>
        {
          qualityStandards.filter((qs) => qs.id === fault.qualityStandardId)[0]
            .name
        }
      </Text>
      <Text>Fault at production step:</Text>
      <Text>
        {
          productionSteps.filter(
            (step) => step.id === fault.productionStepId
          )[0].name
        }
      </Text>
      <Text>Description:</Text>
      <ScrollView style={{height: 100}}>
        <Text>{fault.description ?? "No description"}</Text>
      </ScrollView>
    </View>
  );
};

export default FaultCard;
