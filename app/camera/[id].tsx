import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

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
      router.replace("/inspection-result/[id]" as Href);
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {isFocused && (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          mode="picture"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onBarcodeScanned}
        />
      )}
    </ThemedView>
  );
};

export default memo(CameraScreen);
