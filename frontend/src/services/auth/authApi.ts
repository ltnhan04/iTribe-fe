import axios from "axios";
import { axiosInstance } from "@/config/axiosInstance";

import {
  SignUpType,
  LoginType,
  ProfileType,
  VerifySignUpType,
} from "@/types/auth";

export const login = async ({ email, password }: LoginType) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login`,
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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/signup`,
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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/verify-signup`,
    {
      email,
      otp,
    }
  );
  return response;
};

export const logout = async () => {
  const response = await axiosInstance.post(`/api/v1/auth/logout`);
  return response;
};

export const resentOTP = async (email: string) => {
  return await axiosInstance.post(`/api/v1/auth/resent-otp`, { email });
};

export const getProfile = async (): Promise<ProfileType> => {
  const response = await axiosInstance.get<ProfileType>("/api/v1/auth/profile");
  return response.data;
};

export const updateProfile = async ({
  name,
  address,
  phoneNumber,
}: {
  name: string;
  address: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    country: string;
  };
  phoneNumber: string;
}) => {
  return await axiosInstance.post(`/api/v1/auth/update-profile`, {
    name,
    address,
    phoneNumber,
  });
};

export const forgotPassword = async (email: string) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/forgot-password`,
    { email }
  );
};

export const resetPassword = async (token: string, password: string) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/reset-password/${token}`,
    { password }
  );
};

export const refreshToken = async () => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/refresh-token`,
    { withCredentials: true }
  );
  return response;
};
