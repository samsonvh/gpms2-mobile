import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import ProductFaultForm from "./ProductFaultForm";

type props = {
  closeProductForm: () => void;
};

const FaultyProductForm = ({ closeProductForm }: props) => {
  const [faults, setFaults] = useState([]);
  const [isFaultFormOpened, setIsFaultFormOpened] = useState(false);

  const closeFaultForm = useCallback(() => {
    setIsFaultFormOpened(false);
  }, []);

  const renderFaults = useCallback((item: any) => {
    return <ThemedText>Fault</ThemedText>;
  }, []);

  return (
    <ThemedView style={style.container}>
      <View style={style.form}>
        <View style={style.formInputSection}>
          <ThemedText style={style.formTitle}>New faulty product</ThemedText>
          <ThemedText>Ordinal number in series:</ThemedText>
          <TextInput />
          <ThemedText>Description:</ThemedText>
          <TextInput multiline numberOfLines={4} />
          <View style={style.productFaultLabelSection}>
            <ThemedText>Product faults:</ThemedText>
            <Pressable
              style={style.formActionButton}
              onPress={() => setIsFaultFormOpened(true)}
            >
              <ThemedText>+ Add</ThemedText>
            </Pressable>
          </View>
          <FlatList
            data={faults}
            renderItem={renderFaults}
            style={{
              marginTop: 8,
              marginBottom: 16,
              borderRadius: 4,
            }}
          />
        </View>
        <View style={style.formActionSection}>
          <Pressable style={style.formActionButton} onPress={closeProductForm}>
            <ThemedText>Cancel</ThemedText>
          </Pressable>
          <Pressable style={style.formActionButton} onPress={closeProductForm}>
            <ThemedText>Done</ThemedText>
          </Pressable>
        </View>
      </View>
      <ProductFaultForm faults={faults} setFaults={setFaults} />
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    shadowColor: "#fff",
    elevation: 10,
    flex: 1,
  },
  form: { flexGrow: 1 },
  formTitle: {},
  formInputSection: {
    flexGrow: 1,
  },
  productFaultLabelSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formActionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formActionButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
});

export default FaultyProductForm;
