import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type props = {
  faults: any[];
  setFaults: any;
};

const ProductFaultForm = ({ faults, setFaults }: props) => {
  return (
    <ThemedView style={style.container}>
      <View style={style.form}>
        <ThemedText>New product fault</ThemedText>
        <ThemedText>Violated quality standard:</ThemedText>
        <ThemedText>Description:</ThemedText>
        <TextInput multiline numberOfLines={4} />
        <View style={style.formActionSection}>
          <Pressable style={style.formActionButton}>
            <ThemedText>Cancel</ThemedText>
          </Pressable>
          <Pressable style={style.formActionButton}>
            <ThemedText>Done</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {
  },
  form: {
    elevation: 10,
    shadowColor: "#fff",
  },
  formActionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40
  },
  formActionButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
});

export default ProductFaultForm;
