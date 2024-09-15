import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import Header from "@/components/common/layout/header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  InspectionRequestFilterModel,
  InspectionRequestListingItem,
} from "@/data/types/inspection-request";

const Index = () => {
  const [token, setToken] = useState<string>();
  const [userRole, setUserRole] = useState<string>();
  const [requests, setRequests] = useState<InspectionRequestListingItem[]>();

  const renderItem = useCallback(
    (item: ListRenderItemInfo<InspectionRequestListingItem>) => {
      return <RequestCard key={item.index} inspectionRequest={item.item} />;
    },
    []
  );

  const getToken = async () => {
    const atoken = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("userRole");
    if (atoken && role) {
      setToken(token);
      setUserRole(role);
    }
  };

  const getRequests = async () => {
    const filter: InspectionRequestFilterModel = {
      isAscending: false,
      orderBy: "CreatedDate",
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
      searchString: "",
      status: "",
    };

    const a = await AsyncStorage.getItem("token");

    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/filter`,
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + a,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(filter),
      }
    )
      .then((request) => {
        console.log(request);
        return request.json();
      })
      .then((data) => {
        setRequests(data.data);
        console.log(data.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getToken();
    getRequests();
  }, []);

  return (
    <ThemedView style={{ height: "100%" }}>
      <Header />
      <View style={style.searchBarContainer}>
        <TextInput
          style={style.searchInput}
          placeholder="Search by name or series code"
        />
      </View>
      <View style={style.list}>
        <FlatList
          ItemSeparatorComponent={() => (
            <ThemedView style={{ padding: 8 }}></ThemedView>
          )}
          style={{ maxHeight: 400 }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          data={requests}
          renderItem={renderItem}
          windowSize={5}
        />
      </View>
    </ThemedView>
  );
};

export default Index;

const style = StyleSheet.create({
  header: {},
  list: {
    padding: 12,
    flexGrow: 1,
  },
  searchBarContainer: {
    padding: 12,
  },
  searchInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  statusFilterContainer: {
    width: "100%",
    padding: 8,
  },
  statusFilterButton: {
    borderWidth: 1,
    width: 50,
    height: 50,
    aspectRatio: 1,
  },
});
