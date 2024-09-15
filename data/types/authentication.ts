export type AuthenticationData = {
  accessToken: string;
  account: {
    code: string;
    department: string;
    email: string;
    fullName: string;
    position: string;
    role: string;
  };
};

export type CredentialsInfor = {
  email: string;
  password: string;
};
