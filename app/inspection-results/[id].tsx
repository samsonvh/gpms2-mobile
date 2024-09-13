import FaultyProductCard from "@/components/common/FaultyProductCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import inspectionRequests from "@/data/mock-data/inspection-requests.json";
import FaultyProductForm from "@/components/screens/inspection-results/[id]/FaultyProductForm";
import {
  FaultyProduct,
  InspectionResultInput,
  ProductFault,
} from "@/data/types/InspectionResult";
import { ProductionStepListingItem } from "@/data/types/ProductionStep";
import { QualityStandardListingItem } from "@/data/types/QualityStandard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InspectionRequestDetails } from "@/data/types/inspection-request";

const ResultInputScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [productFormOpened, setProductFormOpened] = useState<boolean>(false);
  const [faultFormOpened, setFaultFormOpened] = useState<boolean>(false);

  const [request, setRequest] = useState<InspectionRequestDetails>();
  const [qualityStandards, setQualityStandards] = useState<
    QualityStandardListingItem[]
  >([]);
  const [productionSteps, setProductionSteps] = useState<
    ProductionStepListingItem[]
  >([]);

  const [result, setResult] = useState<InspectionResultInput>();
  const [faultyProducts, setFaultyProducts] = useState<FaultyProduct[]>([]);

  const [newProduct, setNewProduct] = useState<FaultyProduct>();
  const [productFaults, setProductFaults] = useState<ProductFault[]>([]);
  const [newFault, setNewFault] = useState<ProductFault>();

  const openForm = async (formType: string) => {
    switch (formType) {
      case "fault":
        setProductFormOpened(false);
        setFaultFormOpened(true);
        setNewFault({ productionStepId: "", qualityStandardId: "" });
        break;
      case "product":
        setProductFormOpened(true);
        setNewProduct({ ordinalNumberInSeries: 1, productFaults });
        break;
    }
  };
  const cancelForm = async (formType: string) => {
    switch (formType) {
      case "fault":
        setFaultFormOpened(false);
        setProductFormOpened(true);
        setNewFault(undefined);
        break;
      case "product":
        setProductFormOpened(false);
        setNewProduct(undefined);
        break;
    }
  };
  const doneForm = async (formType: string) => {
    switch (formType) {
      case "fault":
        setProductFaults([...productFaults, newFault!]);
        setNewFault(undefined);
        setNewProduct({ ...newProduct!, productFaults });
        setFaultFormOpened(false);
        setProductFormOpened(true);
        break;
      case "product":
        setFaultyProducts([...faultyProducts, newProduct!]);
        setNewProduct(undefined);
        setProductFaults([]);
        setProductFormOpened(false);
        break;
    }
  };

  const getRequest = async () => {
    const a = await AsyncStorage.getItem("token");

    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/${id}/inspect`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + a,
          "content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setRequest(data));
  };

  const getQualityStandard = async () => {
    const filter = {
      orderBy: "Name",
      isAscending: true,
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    };

    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/specifications/${request?.productSpecification?.id}/quality-standards/filter`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(filter),
      }
    )
      .then((response) => response.json())
      .then((data) => setQualityStandards(data.data));
  };

  const getProductionSteps = async () => {
    const processFilter = {
      orderBy: "Name",
      isAscending: true,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      name: "Kiểm định",
    };

    let inspectionProcess = await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/products/${request?.product?.id}/processes/filter`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(processFilter),
      }
    )
      .then((response) => response.json())
      .then((data) => data.data[0]);

    const stepFilter = {
      orderBy: "Name",
      isAscending: true,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    };
    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/processes/${inspectionProcess.id}/steps/filter`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(stepFilter),
      }
    )
      .then((response) => response.json())
      .then((data) => setProductionSteps(data.data));
  };

  useEffect(() => {
    getRequest();
  }, []);

  useEffect(() => {
    if (faultFormOpened && request) {
      getQualityStandard();
      getProductionSteps();
    }
  }, [faultFormOpened]);

  return (
    <ThemedView style={{ width: "100%", height: "100%" }}>
      <ThemedView style={style.resultForm}>
        <ThemedText style={style.title}>{request?.name}</ThemedText>
        <View>
          <ThemedText style={style.label}>Description:</ThemedText>
          <TextInput multiline numberOfLines={4} style={style.input} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText style={style.label}>
            Faulty products: {faultyProducts.length}
          </ThemedText>
          <Pressable
            style={style.button}
            onPress={async () => await openForm("product")}
          >
            <Text>Add +</Text>
          </Pressable>
        </View>
        <ScrollView style={{ flexGrow: 1 }}>
          {faultyProducts.map((product, index) => (
            <View key={index}>{product.ordinalNumberInSeries}</View>
          ))}
        </ScrollView>
      </ThemedView>
      {productFormOpened && (
        <ThemedView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingVertical: 40,
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <ThemedView style={style.productForm}>
            <View style={{ gap: 8 }}>
              <ThemedText style={style.title}>
                Adding new faulty product
              </ThemedText>
              <View>
                <ThemedText style={style.label}>
                  Ordinal number in series:
                </ThemedText>
                <TextInput style={style.input} keyboardType="number-pad" />
              </View>
              <View>
                <ThemedText style={style.label}>Description:</ThemedText>
                <TextInput multiline numberOfLines={4} style={style.input} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ThemedText style={style.label}>
                  Product faults: {productFaults.length}
                </ThemedText>
                <Pressable
                  style={style.button}
                  onPress={async () => await openForm("fault")}
                >
                  <Text>Add +</Text>
                </Pressable>
              </View>
              <ScrollView></ScrollView>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={style.button}
                onPress={async () => await cancelForm("product")}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={style.button}
                onPress={async () => await doneForm("product")}
              >
                <Text>Done</Text>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      )}
      {faultFormOpened && (
        <ThemedView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingVertical: 40,
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <ThemedView style={style.productForm}>
            <View style={{ gap: 8 }}>
              <ThemedText style={style.title}>Adding new fault</ThemedText>
              <View>
                <ThemedText style={style.label}>
                  Violated quality standard:
                </ThemedText>
                <Picker style={style.input}>
                  {qualityStandards.map((standard) => (
                    <Picker.Item
                      key={standard.id}
                      label={standard.name}
                      value={standard.id}
                    />
                  ))}
                </Picker>
              </View>
              <View>
                <ThemedText style={style.label}>
                  Fault at production step:
                </ThemedText>
                <Picker style={style.input}>
                  {productionSteps.map((step) => (
                    <Picker.Item
                      key={step.id}
                      label={step.name}
                      value={step.id}
                    />
                  ))}
                </Picker>
              </View>
              <View>
                <ThemedText style={style.label}>Description:</ThemedText>
                <TextInput multiline numberOfLines={4} style={style.input} />
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={style.button}
                onPress={async () => await cancelForm("fault")}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={style.button}
                onPress={async () => await doneForm("fault")}
              >
                <Text>Done</Text>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const style = StyleSheet.create({
  resultForm: { padding: 12, gap: 8 },
  productForm: {
    height: "100%",
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 8,
  },
  faultForm: {},
  title: { fontWeight: 700, fontSize: 20, paddingTop: 8, paddingBottom: 12 },
  label: {
    fontWeight: 600,
  },
  input: {
    marginTop: 4,
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
});

//   const [isFaultFormOpened, setIsFaultFormOpened] = useState(false);
//   const [isProductFormOpened, setIsProductFormOpened] = useState(false);

//   const [oldLength, setOldLength] = useState(0);
//   const [result, setResult] = useState<InspectionResultInput>({
//     faultyProducts: [],
//   });
//   const [products, setProducts] = useState<FaultyProduct[]>([]);
//   const [newProduct, setNewProduct] = useState<FaultyProduct>();
//   const [faults, setFaults] = useState<ProductFault[]>([]);
//   const [newFault, setNewFault] = useState<ProductFault>();

//   const [qualityStandards, setQualityStandards] =
//     useState<QualityStandardListingItem[]>();
//   const [productionSteps, setProductionSteps] =
//     useState<ProductionStepListingItem[]>();
//   const getToken = async () => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) setToken(token);
//   };

//   const getProductionSteps = async () => {
//     await fetch(
//       `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/series/` +
//         seriesId +
//         "/processes",
//       {
//         method: "POST",
//         headers: {
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           orderBy: "orderNumber",
//           isAscending: true,
//           pagination: {
//             pageIndex: 0,
//             pageSize: 100,
//           },
//           code: "",
//           name: "Kiểm Định",
//         }),
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setProductionSteps(data[0].steps);
//       });
//   };
//   const getQualityStandards = async () => {
//     await fetch(
//       `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/specifications/` +
//         specificationId +
//         "/quality-standards/filter",
//       {
//         method: "POST",
//         headers: {
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           orderBy: "name",
//           isAscending: true,
//           pagination: {
//             pageIndex: 0,
//             pageSize: 100,
//           },
//           name: "",
//         }),
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setQualityStandards(data.data);
//       });
//   };
//   const setResultValue = async () => {
//     if (products.length != oldLength) {
//       setOldLength(products.length);
//       setResult({ ...result, faultyProducts: products });
//     }
//   };

//   useEffect(() => {
//     getToken();
//   }, []);

//   useEffect(() => {
//     if (!qualityStandards) {
//       getQualityStandards();
//     }
//     if (!productionSteps) {
//       getProductionSteps();
//     }
//   }, [result]);

//   useEffect(() => {
//     setResultValue();
//   }, [products]);

//   const submitResult = async () => {
//     await fetch(
//       `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/` +
//         id +
//         "/results",
//       {
//         method: "POST",
//         headers: {
//           authorization: "Bearer " + token,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(result),
//       }
//     )
//       .then((response) => response.json())
//       .then((data) =>
//         data == true ? console.log("Succeed") : console.log("Failed")
//       )
//       .catch((error) => console.log(error))
//       .finally(() => {
//         router.back();
//       });
//   };

//   const renderProduct = useCallback(
//     (item: ListRenderItemInfo<FaultyProduct>) => {
//       return (
//         <FaultyProductCard
//           key={item.item.ordinalNumberInSeries}
//           faultyProduct={item.item}
//         />
//       );
//     },
//     []
//   );
//   const renderFault = useCallback((item: ListRenderItemInfo<ProductFault>) => {
//     const qualityStandardName = qualityStandards?.find(
//       (qs) => qs.id === item.item.qualityStandardId
//     )?.name;
//     const productionStepName = productionSteps?.find(
//       (ps) => ps.id === item.item.productionStepId
//     )?.name;

//     return (
//       <ThemedView>
//         <ThemedText>Violated quality standard:</ThemedText>
//         <ThemedText>{qualityStandardName}</ThemedText>
//         <ThemedText>Fault at production step:</ThemedText>
//         <ThemedText>{productionStepName}</ThemedText>
//         <ThemedText>Description:</ThemedText>
//         <ThemedText>{item.item.description}</ThemedText>
//       </ThemedView>
//     );
//   }, []);

//   return (
//     <ThemedView style={style.formContainer}>
//       <View style={style.resultForm}>
//         <ThemedText style={style.label}>Description:</ThemedText>
//         <TextInput
//           style={style.textArea}
//           multiline
//           numberOfLines={5}
//           onChangeText={(value) => setResult({ ...result, description: value })}
//         />
//         <View style={style.labelWithAddButtonContainer}>
//           <ThemedText style={style.label}>
//             Faulty products: {products.length}
//           </ThemedText>
//           <Pressable
//             style={style.addButton}
//             onPress={() => {
//               setIsProductFormOpened(true);
//               setNewProduct({
//                 ordinalNumberInSeries: 1,
//                 productFaults: faults,
//               });
//             }}
//           >
//             <ThemedText>Add</ThemedText>
//           </Pressable>
//         </View>
//         <FlatList data={products} renderItem={renderProduct} />
//         <View style={style.labelWithAddButtonContainer}>
//           <Pressable
//             style={style.addButton}
//             onPress={() => {
//               router.back();
//             }}
//           >
//             <ThemedText>cancel</ThemedText>
//           </Pressable>
//           <Pressable
//             style={style.addButton}
//             onPress={async () => {
//               await submitResult();
//             }}
//           >
//             <ThemedText>done</ThemedText>
//           </Pressable>
//         </View>
//       </View>
//       {isProductFormOpened && (
//         <View style={style.floatingFormContainer}>
//           <ThemedView style={style.faultyProductForm}>
//             <ThemedText style={style.label}>
//               Ordinal number in series:
//             </ThemedText>
//             <TextInput
//               // defaultValue={newProduct?.ordinalNumberInSeries.toString()}
//               value={newProduct?.ordinalNumberInSeries.toString()}
//               style={style.textInput}
//               inputMode="numeric"
//               onChangeText={(value) => {
//                 const parsedValue = parseInt(value);
//                 setNewProduct({
//                   ...newProduct!,
//                   ordinalNumberInSeries: isNaN(parsedValue) ? 1 : parsedValue,
//                 });
//               }}
//             />
//             <ThemedText style={style.label}>Description:</ThemedText>
//             <TextInput
//               defaultValue={
//                 newProduct?.description ? newProduct.description : ""
//               }
//               style={style.textArea}
//               multiline
//               numberOfLines={5}
//               onChangeText={(value) => {
//                 setNewProduct({
//                   ...newProduct!,
//                   description: value,
//                 });
//               }}
//             />
//             <View style={style.labelWithAddButtonContainer}>
//               <ThemedText style={style.label}>
//                 Product faults: {faults.length}
//               </ThemedText>
//               <Pressable
//                 style={style.addButton}
//                 onPress={() => {
//                   setNewFault({
//                     productionStepId: productionSteps
//                       ? productionSteps[0].id
//                       : "",
//                     qualityStandardId: qualityStandards
//                       ? qualityStandards[0].id
//                       : "",
//                   });
//                   setIsProductFormOpened(false);
//                   setIsFaultFormOpened(true);
//                 }}
//               >
//                 <ThemedText>Add</ThemedText>
//               </Pressable>
//             </View>
//             <FlatList data={faults} renderItem={renderFault} />
//             <View style={style.labelWithAddButtonContainer}>
//               <Pressable
//                 style={style.addButton}
//                 onPress={() => {
//                   setNewProduct(undefined);
//                   setFaults([]);
//                   setIsProductFormOpened(false);
//                 }}
//               >
//                 <ThemedText>cancel</ThemedText>
//               </Pressable>
//               <Pressable
//                 style={style.addButton}
//                 onPress={async () => {
//                   if (newProduct) {
//                     setProducts([...products, newProduct]);
//                     setResult({ ...result, faultyProducts: products });
//                     setNewProduct(undefined);
//                     setFaults([]);
//                     setIsProductFormOpened(false);
//                   }
//                 }}
//               >
//                 <ThemedText>done</ThemedText>
//               </Pressable>
//             </View>
//           </ThemedView>
//         </View>
//       )}
//       {isFaultFormOpened && (
//         <View style={style.floatingFormContainer}>
//           <ThemedView style={style.productFaultForm}>
//             <ThemedText style={style.label}>
//               Violated quality standard:
//             </ThemedText>
//             <Picker
//               selectedValue={newFault?.qualityStandardId}
//               onValueChange={(value) =>
//                 setNewFault({
//                   ...newFault!,
//                   qualityStandardId: value as string,
//                 })
//               }
//             >
//               {qualityStandards?.map((qs) => (
//                 <Picker.Item key={qs.id} label={qs.name} value={qs.id} />
//               ))}
//             </Picker>
//             <ThemedText style={style.label}>
//               Fault at production step:
//             </ThemedText>
//             <Picker
//               selectedValue={newFault?.productionStepId}
//               onValueChange={(value) =>
//                 setNewFault({ ...newFault!, productionStepId: value as string })
//               }
//             >
//               {productionSteps?.map((step) => (
//                 <Picker.Item key={step.id} label={step.name} value={step.id} />
//               ))}
//             </Picker>
//             <ThemedText style={style.label}>Description:</ThemedText>
//             <TextInput
//               style={style.textArea}
//               multiline
//               numberOfLines={5}
//               onChangeText={(value) =>
//                 setNewFault({ ...newFault!, description: value })
//               }
//             />
//             <View style={style.labelWithAddButtonContainer}>
//               <Pressable
//                 style={style.addButton}
//                 onPress={() => {
//                   setNewFault(undefined);
//                   setIsFaultFormOpened(false);
//                   setIsProductFormOpened(true);
//                 }}
//               >
//                 <ThemedText>cancel</ThemedText>
//               </Pressable>
//               <Pressable
//                 style={style.addButton}
//                 onPress={async () => {
//                   if (newFault) {
//                     setFaults([...faults, newFault]);
//                     setNewProduct({ ...newProduct!, productFaults: faults });
//                     setIsFaultFormOpened(false);
//                     setIsProductFormOpened(true);
//                     setNewFault(undefined);
//                   }
//                 }}
//               >
//                 <ThemedText>done</ThemedText>
//               </Pressable>
//             </View>
//           </ThemedView>
//         </View>
//       )}
//     </ThemedView>
//   );
// };

export default memo(ResultInputScreen);

// const style = StyleSheet.create({
//   formContainer: {
//     position: "relative",
//     height: "100%",
//     paddingHorizontal: 20,
//     paddingTop: 40,
//     paddingBottom: 40,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: 600,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderRadius: 4,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderRadius: 4,
//   },
//   labelWithAddButtonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   addButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//   },
//   floatingFormContainer: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 60,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   resultForm: {
//     width: "100%",
//     height: "100%",
//     paddingHorizontal: 0,
//     borderRadius: 8,
//   },
//   faultyProductForm: {
//     width: "100%",
//     height: "100%",
//     padding: 20,
//     borderRadius: 8,
//   },
//   productFaultForm: {
//     width: "100%",
//     padding: 20,
//     borderRadius: 8,
//   },
// });
