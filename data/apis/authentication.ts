import { AuthenticationData, CredentialsInfor } from "../types/authentication";

export const signInWithCredentials = async ({
  email,
  password,
}: CredentialsInfor) => {
  const url = `${process.env.EXPO_PUBLIC_API_SERVER}/api/v1/auth/sign-in`;

  const authenticationData: AuthenticationData = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());

  return authenticationData;
};
