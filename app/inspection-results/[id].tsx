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

const ResultInputScreen = () => {
  const router = useRouter();
  const [token, setToken] = useState<string>();
  const { id, seriesId, specificationId } = useLocalSearchParams();
  const [isFaultFormOpened, setIsFaultFormOpened] = useState(false);
  const [isProductFormOpened, setIsProductFormOpened] = useState(false);

  const [oldLength, setOldLength] = useState(0);
  const [result, setResult] = useState<InspectionResultInput>({
    faultyProducts: [],
  });
  const [products, setProducts] = useState<FaultyProduct[]>([]);
  const [newProduct, setNewProduct] = useState<FaultyProduct>();
  const [faults, setFaults] = useState<ProductFault[]>([]);
  const [newFault, setNewFault] = useState<ProductFault>();

  const [qualityStandards, setQualityStandards] =
    useState<QualityStandardListingItem[]>();
  const [productionSteps, setProductionSteps] =
    useState<ProductionStepListingItem[]>();
  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) setToken(token);
  };

  const getProductionSteps = async () => {
    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/series/` +
        seriesId +
        "/processes",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderBy: "orderNumber",
          isAscending: true,
          pagination: {
            pageIndex: 0,
            pageSize: 100,
          },
          code: "",
          name: "Kiểm Định",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setProductionSteps(data[0].steps);
      });
  };
  const getQualityStandards = async () => {
    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/specifications/` +
        specificationId +
        "/quality-standards/filter",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderBy: "name",
          isAscending: true,
          pagination: {
            pageIndex: 0,
            pageSize: 100,
          },
          name: "",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setQualityStandards(data.data);
      });
  };
  const setResultValue = async () => {
    if (products.length != oldLength) {
      setOldLength(products.length);
      setResult({ ...result, faultyProducts: products });
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (!qualityStandards) {
      getQualityStandards();
    }
    if (!productionSteps) {
      getProductionSteps();
    }
  }, [result]);

  useEffect(() => {
    setResultValue();
  }, [products]);

  const submitResult = async () => {
    await fetch(
      `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/inspection-requests/` +
        id +
        "/results",
      {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(result),
      }
    )
      .then((response) => response.json())
      .then((data) =>
        data == true ? console.log("Succeed") : console.log("Failed")
      )
      .catch((error) => console.log(error))
      .finally(() => {
        router.back();
      });
  };

  const renderProduct = useCallback(
    (item: ListRenderItemInfo<FaultyProduct>) => {
      return (
        <FaultyProductCard
          key={item.item.ordinalNumberInSeries}
          faultyProduct={item.item}
        />
      );
    },
    []
  );
  const renderFault = useCallback((item: ListRenderItemInfo<ProductFault>) => {
    const qualityStandardName = qualityStandards?.find(
      (qs) => qs.id === item.item.qualityStandardId
    )?.name;
    const productionStepName = productionSteps?.find(
      (ps) => ps.id === item.item.productionStepId
    )?.name;

    return (
      <ThemedView>
        <ThemedText>Violated quality standard:</ThemedText>
        <ThemedText>{qualityStandardName}</ThemedText>
        <ThemedText>Fault at production step:</ThemedText>
        <ThemedText>{productionStepName}</ThemedText>
        <ThemedText>Description:</ThemedText>
        <ThemedText>{item.item.description}</ThemedText>
      </ThemedView>
    );
  }, []);

  return (
    <ThemedView style={style.formContainer}>
      <View style={style.resultForm}>
        <ThemedText style={style.label}>Description:</ThemedText>
        <TextInput
          style={style.textArea}
          multiline
          numberOfLines={5}
          onChangeText={(value) => setResult({ ...result, description: value })}
        />
        <View style={style.labelWithAddButtonContainer}>
          <ThemedText style={style.label}>
            Faulty products: {products.length}
          </ThemedText>
          <Pressable
            style={style.addButton}
            onPress={() => {
              setIsProductFormOpened(true);
              setNewProduct({
                ordinalNumberInSeries: 1,
                productFaults: faults,
              });
            }}
          >
            <ThemedText>Add</ThemedText>
          </Pressable>
        </View>
        <FlatList data={products} renderItem={renderProduct} />
        <View style={style.labelWithAddButtonContainer}>
          <Pressable
            style={style.addButton}
            onPress={() => {
              router.back();
            }}
          >
            <ThemedText>cancel</ThemedText>
          </Pressable>
          <Pressable
            style={style.addButton}
            onPress={async () => {
              await submitResult();
            }}
          >
            <ThemedText>done</ThemedText>
          </Pressable>
        </View>
      </View>
      {isProductFormOpened && (
        <View style={style.floatingFormContainer}>
          <ThemedView style={style.faultyProductForm}>
            <ThemedText style={style.label}>
              Ordinal number in series:
            </ThemedText>
            <TextInput
              // defaultValue={newProduct?.ordinalNumberInSeries.toString()}
              value={newProduct?.ordinalNumberInSeries.toString()}
              style={style.textInput}
              inputMode="numeric"
              onChangeText={(value) => {
                const parsedValue = parseInt(value);
                setNewProduct({
                  ...newProduct!,
                  ordinalNumberInSeries: isNaN(parsedValue) ? 1 : parsedValue,
                });
              }}
            />
            <ThemedText style={style.label}>Description:</ThemedText>
            <TextInput
              defaultValue={
                newProduct?.description ? newProduct.description : ""
              }
              style={style.textArea}
              multiline
              numberOfLines={5}
              onChangeText={(value) => {
                setNewProduct({
                  ...newProduct!,
                  description: value,
                });
              }}
            />
            <View style={style.labelWithAddButtonContainer}>
              <ThemedText style={style.label}>
                Product faults: {faults.length}
              </ThemedText>
              <Pressable
                style={style.addButton}
                onPress={() => {
                  setNewFault({
                    productionStepId: productionSteps
                      ? productionSteps[0].id
                      : "",
                    qualityStandardId: qualityStandards
                      ? qualityStandards[0].id
                      : "",
                  });
                  setIsProductFormOpened(false);
                  setIsFaultFormOpened(true);
                }}
              >
                <ThemedText>Add</ThemedText>
              </Pressable>
            </View>
            <FlatList data={faults} renderItem={renderFault} />
            <View style={style.labelWithAddButtonContainer}>
              <Pressable
                style={style.addButton}
                onPress={() => {
                  setNewProduct(undefined);
                  setFaults([]);
                  setIsProductFormOpened(false);
                }}
              >
                <ThemedText>cancel</ThemedText>
              </Pressable>
              <Pressable
                style={style.addButton}
                onPress={async () => {
                  if (newProduct) {
                    setProducts([...products, newProduct]);
                    setResult({ ...result, faultyProducts: products });
                    setNewProduct(undefined);
                    setFaults([]);
                    setIsProductFormOpened(false);
                  }
                }}
              >
                <ThemedText>done</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      )}
      {isFaultFormOpened && (
        <View style={style.floatingFormContainer}>
          <ThemedView style={style.productFaultForm}>
            <ThemedText style={style.label}>
              Violated quality standard:
            </ThemedText>
            <Picker
              selectedValue={newFault?.qualityStandardId}
              onValueChange={(value) =>
                setNewFault({
                  ...newFault!,
                  qualityStandardId: value as string,
                })
              }
            >
              {qualityStandards?.map((qs) => (
                <Picker.Item key={qs.id} label={qs.name} value={qs.id} />
              ))}
            </Picker>
            <ThemedText style={style.label}>
              Fault at production step:
            </ThemedText>
            <Picker
              selectedValue={newFault?.productionStepId}
              onValueChange={(value) =>
                setNewFault({ ...newFault!, productionStepId: value as string })
              }
            >
              {productionSteps?.map((step) => (
                <Picker.Item key={step.id} label={step.name} value={step.id} />
              ))}
            </Picker>
            <ThemedText style={style.label}>Description:</ThemedText>
            <TextInput
              style={style.textArea}
              multiline
              numberOfLines={5}
              onChangeText={(value) =>
                setNewFault({ ...newFault!, description: value })
              }
            />
            <View style={style.labelWithAddButtonContainer}>
              <Pressable
                style={style.addButton}
                onPress={() => {
                  setNewFault(undefined);
                  setIsFaultFormOpened(false);
                  setIsProductFormOpened(true);
                }}
              >
                <ThemedText>cancel</ThemedText>
              </Pressable>
              <Pressable
                style={style.addButton}
                onPress={async () => {
                  if (newFault) {
                    setFaults([...faults, newFault]);
                    setNewProduct({ ...newProduct!, productFaults: faults });
                    setIsFaultFormOpened(false);
                    setIsProductFormOpened(true);
                    setNewFault(undefined);
                  }
                }}
              >
                <ThemedText>done</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      )}
    </ThemedView>
  );
};

export default memo(ResultInputScreen);

const style = StyleSheet.create({
  formContainer: {
    position: "relative",
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 4,
  },
  labelWithAddButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  floatingFormContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  resultForm: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  faultyProductForm: {
    width: "100%",
    height: "100%",
    padding: 20,
    borderRadius: 8,
  },
  productFaultForm: {
    width: "100%",
    padding: 20,
    borderRadius: 8,
  },
});
