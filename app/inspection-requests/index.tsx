import RequestCard from "@/components/common/RequestCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  NativeScrollEvent,
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
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const DynamicHeaderSection = ({ height }: any) => {
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(height, config),
    };
  });

  return (
    <Animated.View style={[styles.headerSection, headerStyle]}>
      <SearchBox />
    </Animated.View>
  );
};

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
  };

  useEffect(() => {
    getToken();
    getRequests();
  }, []);

  // Shared value to track scroll position
  const scrollY = useSharedValue(0);
  const isExpanded = useSharedValue(true);

  const scrollHandler2 = (event: NativeScrollEvent) => {
    scrollY.value = event.contentOffset.y;

    // Buffer the threshold to prevent rapid toggling within a small scroll range
    const collapseThreshold = 20;
    const expandThreshold = 0;

    // Expand view when scrolling close to the top
    if (scrollY.value <= expandThreshold && !isExpanded.value) {
      isExpanded.value = true; // Expand the view
    }

    // Collapse view when scrolling further down
    if (scrollY.value > collapseThreshold && isExpanded.value) {
      isExpanded.value = false; // Collapse the view
    }
  };

  // Scroll handler to update scrollY on scroll
  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log(scrollY.value);
    scrollY.value = event.contentOffset.y;

    // Buffer the threshold to prevent rapid toggling within a small scroll range
    const collapseThreshold = 60;
    const expandThreshold = 40;

    // Expand view when scrolling close to the top
    if (scrollY.value <= expandThreshold && !isExpanded.value) {
      isExpanded.value = true; // Expand the view
    }

    // Collapse view when scrolling further down
    if (scrollY.value > collapseThreshold && isExpanded.value) {
      isExpanded.value = false; // Collapse the view
    }
  });

  // Animated style for the view with dynamic height
  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate height based on scroll position
    const height = withSpring(isExpanded.value ? 140 : 50, {
      damping: 10,
      stiffness: 90,
    });

    const gap = withSpring(isExpanded.value ? 12 : 0);
    // scrollY.value < 50
    //   ? withSpring(
    //       interpolate(
    //         scrollY.value,
    //         [0, 200],
    //         [300, 100],
    //         Extrapolation.CLAMP
    //       ),
    //       { damping: 20, stiffness: 100 }
    //     )
    //   : 100;

    return {
      height,
      gap
    };
  });

  return (
    <LinearGradient style={styles.screen} colors={["#FFEEEE", "#DDEFBB"]}>
      <Animated.View style={[animatedStyle]}>
        <Header />
        <SearchBox />
      </Animated.View>
      <View
        style={{
          flex: 1,
          paddingTop: 20,
          paddingBottom: 80,
          marginHorizontal: 20,
          backgroundColor: "#fff",
          elevation: 10,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <Text
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.2)",
            marginHorizontal: 8,
            paddingHorizontal: 20,
            paddingBottom: 16,
            fontSize: 22,
            fontWeight: "600",
          }}
        >
          Inspection requests
        </Text>
        <Animated.FlatList
          data={requests}
          // keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          onScroll={scrollHandler}
          scrollEventThrottle={16} // Ensures smooth updates during scrolling
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 12,
            paddingBottom: 40,
          }} // Add padding to the content
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 20,
                alignSelf: "center",
                marginTop: 20,
                fontStyle: "italic",
              }}
            >
              No request at the moment.
            </Text>
          }
        />
      </View>
    </LinearGradient>
  );

  // return (
  //   <ThemedView style={style.screen}>
  //     <Header />
  //     <SearchBox />
  //     <View style={{ flexGrow: 1 }}>
  //       <Text style={style.title}>Approved inspection requests:</Text>
  //       <View style={style.listContainer}>
  //         <FlatList
  //           // ItemSeparatorComponent={() => (
  //           //   <ThemedView style={{ padding: 8 }}></ThemedView>
  //           // )}
  //           style={style.list}
  //           initialNumToRender={5}
  //           maxToRenderPerBatch={5}
  //           data={requests}
  //           renderItem={renderItem}
  //           windowSize={5}
  //           onRefresh={onRefresh}
  //           refreshing={isRefreshing}
  //           ListEmptyComponent={
  //             <Text
  //               style={{
  //                 fontSize: 20,
  //                 alignSelf: "center",
  //                 marginTop: 20,
  //                 fontStyle: "italic",
  //               }}
  //             >
  //               No request at the moment.
  //             </Text>
  //           }
  //         />
  //       </View>
  //     </View>
  //   </ThemedView>
  // );
};

export default Index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 40,
  },
  headerSection: {
    paddingBottom: 20,
  },
  listSection: {
    flexGrow: 1,
    padding: 20,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#f6fce9",
  },
  title: {},
  listContainer: {},
  list: {},
});

// const style = StyleSheet.create({
//   screen: {
//     height: "100%",
//     paddingTop: 40,
//     paddingBottom: 80,
//     gap: 12,
//     backgroundColor: "#f5fffa",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginHorizontal: 20,
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 12,
//     paddingTop: 0,
//     paddingBottom: 12,
//     overflow: "hidden",
//   },
//   list: {
//     height: 100,
//     flexGrow: 1,
//   },
// });
