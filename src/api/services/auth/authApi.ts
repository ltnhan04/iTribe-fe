import axios from "axios";
import {
  SignUpType,
  LoginType,
  VerifySignUpType,
} from "@/api/services/auth/authType";

export const login = async ({ email, password }: LoginType) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`,
    {
      email,
      password,
    }
  );
  return response;
};

export const signUp = async ({ name, email, password }: SignUpType) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/signup`,
    {
      name,
      email,
      password,
    }
  );
  return response;
};

export const verifySignUp = async ({ email, otp }: VerifySignUpType) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/verify-signup`,
    {
      email,
      otp,
    }
  );
  return response;
};
