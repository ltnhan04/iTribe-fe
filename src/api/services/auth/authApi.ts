import axios from "axios";
import { axiosInstance } from "@/config/axiosInstance";

import {
  SignUpType,
  LoginType,
  VerifySignUpType,
  ProfileType,
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

export const logout = async () => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`
  );
  return response;
};

export const resentOTP = async (email: string) => {
  return await axiosInstance.post(`/api/auth/resent-otp`, { email });
};

export const getProfile = async () => {
  return await axiosInstance.get<ProfileType>(`/api/auth/profile`);
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
  return await axiosInstance.post(`/api/auth/update-profile`, {
    name,
    address,
    phoneNumber,
  });
};

export const forgotPassword = async (email: string) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/forgot-password`,
    { email }
  );
};

export const resetPassword = async (token: string, password: string) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/reset-password/${token}`,
    { password }
  );
};

export const refreshToken = async () => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/refresh-token`,
    { withCredentials: true }
  );
  return response;
};
