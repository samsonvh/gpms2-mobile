import Header from "@/components/common/layout/header/Header";
import PendingSection from "@/components/screens/inspection-requests/index/PendingSection";
import { ThemedView } from "@/components/ThemedView";
import { Text, View } from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        gap: 20,
      }}
    >
      <Header />
      <PendingSection inspectionRequests={inspectionRequests}/>
    </ThemedView>
  );
}
