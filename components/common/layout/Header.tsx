import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";

const Header = () => {
  const [datetime, setDatetime] = useState(new Date());

  setInterval(() => {
    setDatetime(new Date());
  }, 1000);

  return (
    <ThemedView
      style={{
        padding: 20,
        shadowRadius: 8,
        shadowOpacity: 0.15,
        shadowOffset: { height: 2, width: 0 },
        borderRadius: 8,
      }}
    >
      <ThemedText>{datetime.toLocaleDateString()} - {datetime.toLocaleTimeString()}</ThemedText>
    </ThemedView>
  );
};

export default Header;
