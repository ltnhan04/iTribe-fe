import axios from "axios";
import { axiosInstance } from "@/config/axiosInstance";

import {
  SignUpType,
  LoginType,
  VerifySignUpType,
} from "@/api/services/auth/authType";

export const login = async ({ email, password }: LoginType) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
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

export const getProfile = async () => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/profile`
  );
  return response;
};

export const refreshToken = async () => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/refresh-token`,
    { withCredentials: true }
  );
  return response;
};
