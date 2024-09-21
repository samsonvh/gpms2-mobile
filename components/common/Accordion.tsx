import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const AccordionItem = ({
  title,
  content,
}: {
  title: any;
  content: string;
}) => {
  const [open, setOpen] = useState(false);
  const animationHeight = useSharedValue(0); // Initial height of the accordion content

  // Define the animated style for the accordion content
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animationHeight.value, { duration: 300 }), // Smooth transition
    };
  });

  const toggleAccordion = () => {
    setOpen(!open);
    // Animate the height based on whether the accordion is opened or closed
    animationHeight.value = open ? 0 : 150; // You can set content height dynamically
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.contentText}>{content}</Text>
      </Animated.View>
    </View>
  );
};

const Accordion = () => {
  return (
    <View style={styles.container}>
      <AccordionItem title="Item 1" content="This is the content of item 1" />
      <AccordionItem title="Item 2" content="This is the content of item 2" />
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  accordionContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    overflow: "hidden",
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  contentText: {
    fontSize: 14,
    paddingVertical: 10,
  },
});
