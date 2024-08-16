import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const RequestCard = () => {
  return (
    <ThemedView
      darkColor={Colors.dark.lighterBackground}
      style={{
        elevation: 40,
        marginBottom: 12,
        padding: 20,
        borderRadius: 4,
        // shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center",}}
      >
        <ThemedText numberOfLines={2} style={{fontWeight: 700, flexShrink: 1, flexGrow: 1, flex: 1}}>A long long long long long long long long name</ThemedText>
        <TouchableOpacity style={{paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, marginLeft: 16, marginRight: 8}}>
          <Text style={{color: "#fff"}}>DECLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100}}>
          <Text>APPROVE</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 12, marginTop: 12}}>
        <View style={{flexGrow: 1}}>
          <ThemedText style={{fontSize: 12}}>Production series: SR-2020</ThemedText>
          <ThemedText style={{fontSize: 12}}>Production plan: BATCH-001</ThemedText>
        </View>
        <View style={{alignItems: "flex-end"}}>
          <ThemedText style={{fontSize: 12}}>Creator: samson</ThemedText>
          <ThemedText style={{fontSize: 12}}>Created: 01/01/2001</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default RequestCard;
