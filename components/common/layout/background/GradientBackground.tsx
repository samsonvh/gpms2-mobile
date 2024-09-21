import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

const GradientBackground = ({ children }: { children: ReactNode }) => {
  return <View>{children}</View>;
};

export default GradientBackground;

const styles = StyleSheet.create({});
