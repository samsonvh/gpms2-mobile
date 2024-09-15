import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { ThemedText } from "../ThemedText";

const SearchBox = () => {
  return (
    <View style={style.searchBox}>
      <View style={style.textInputContainer}>
        <TextInput
          style={style.textInput}
          numberOfLines={1}
          placeholder="Search by series code or name"
        />
      </View>
      <Pressable style={style.searchButton}>
        <Feather
          style={style.searchIcon}
          name="search"
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    gap: 4,
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    elevation: 1,
    borderRadius: 8,
  },
  textInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  textInput: {
    paddingHorizontal: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 2,
  },
  searchIcon: {
  },
});

export default SearchBox;
