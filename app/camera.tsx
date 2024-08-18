import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Button, Text, View } from "react-native";

const CameraScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(!isFocused);
      console.log(isFocused);
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission?.granted) {
    // Camera permissions are not granted yet
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isFocused && (
        <Camera
          ratio="1:1"
          style={{ flex: 1 }}
          type={CameraType.back}
          barCodeScannerSettings={{
            barCodeTypes: BarCodeScanner.Constants.BarCodeType.qr,
          }}
          onBarCodeScanned={(result) => console.log(result.data)}
        />
      )}
    </View>
  );
};

export default CameraScreen;
