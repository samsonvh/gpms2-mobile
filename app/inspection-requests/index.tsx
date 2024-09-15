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
import { SearchBar } from "react-native-screens";
import SearchBox from "@/components/common/SearchBox";

const Index = () => {
  const [token, setToken] = useState<string>();
  const [userRole, setUserRole] = useState<string>();
  const [isRefreshing, setIsRefreshing] = useState(false);
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
          Authorization: "Bearer " + a,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(filter),
      }
    )
      .then((request) => {
        return request.json();
      })
      .then((data) => {
        setRequests(data.data);
        console.log(data.data);
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getRequests().then(() => setIsRefreshing(false));
  }

  useEffect(() => {
    getToken();
    getRequests();
  }, []);

  return (
    <ThemedView style={style.screen}>
      <Header />
      <SearchBox />
      <View style={{ flexGrow: 1 }}>
        <Text style={style.title}>Approved inspection requests:</Text>
        <View style={style.listContainer}>
          <FlatList
            // ItemSeparatorComponent={() => (
            //   <ThemedView style={{ padding: 8 }}></ThemedView>
            // )}
            style={style.list}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            data={requests}
            renderItem={renderItem}
            windowSize={5}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        </View>
      </View>
    </ThemedView>
  );
};

export default Index;

const style = StyleSheet.create({
  screen: {
    height: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 20,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 12,
    overflow: "hidden",
  },
  list: {
    height: 100,
    flexGrow: 1,
  },
});
