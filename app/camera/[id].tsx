import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  Href,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CameraScreen = () => {
  const { id } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center" }}>
        <Pressable onPress={requestPermission} style={{ flex: 1 }}>
          <ThemedText>Grant Permission</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const onBarcodeScanned = (item: BarcodeScanningResult) => {
    if (item.data === id) {
      router.replace({ pathname: "/inspection-results/new-form/[id]", params: { id } });
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={style.screen}>
      <Pressable style={style.backButton} onPress={() => router.back()}>
        <AntDesign name="back" size={24} color="black" />
        <ThemedText style={{ fontSize: 20, fontWeight: "700" }}>
          Back
        </ThemedText>
      </Pressable>
      {isFocused && (
        <CameraView
          style={style.camera}
          facing="back"
          mode="picture"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onBarcodeScanned}
        />
      )}
    </ThemedView>
  );
};

const style = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    top: 40,
    left: 20,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: "#fff",
    elevation: 10,
    zIndex: 1,
  },
});

export default memo(CameraScreen);
