import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithCredentials } from "../apis/authentication";
import { CredentialsInfor } from "../types/authentication";

export const loginHandler = async ({ email, password }: CredentialsInfor) => {
  const authenticationData = await signInWithCredentials({ email, password });

  console.log(authenticationData);

  await AsyncStorage.setItem("token", authenticationData.accessToken);
  await AsyncStorage.setItem("userName", authenticationData.account.fullName);
  await AsyncStorage.setItem("userRole", authenticationData.account.role);

  return (await AsyncStorage.getItem("token")) ? true : false;
};
