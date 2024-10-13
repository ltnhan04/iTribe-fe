import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, signUp, verifySignUp } from "@/api/services/auth/authApi";
import {
  LoginType,
  SignUpType,
  VerifySignUpType,
} from "@/api/services/auth/authType";
import { ErrorResponse } from "@/app/(auth)/type";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { user, navigate }: { user: LoginType; navigate: (path: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(user);
      if (response.status === 200) {
        navigate("/");
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: unknown) {
      const typedError = error as ErrorResponse;
      const errorMsg =
        typedError?.response?.data?.message || "Đăng nhập thất bại!";
      return rejectWithValue(errorMsg);
    }
  }
);

export const signUpThunk = createAsyncThunk(
  "auth/signUp",
  async (
    {
      user,
      navigate,
    }: {
      user: SignUpType;
      navigate: (path: string) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await signUp(user);
      if (response.status === 200) {
        navigate("/register/verify");
        const { email } = user;
        return { email, ...response.data };
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      const typedError = error as ErrorResponse;
      const errorMsg =
        typedError?.response?.data?.message || "Đăng ký thất bại!";
      return rejectWithValue(errorMsg);
    }
  }
);

export const verifySignUpThunk = createAsyncThunk(
  "auth/signUp/verifySignUp",
  async (
    {
      verify,
      navigate,
    }: { verify: VerifySignUpType; navigate: (path: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifySignUp(verify);
      if (response.status === 200) {
        navigate("/");
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      const typedError = error as ErrorResponse;
      const errorMsg =
        typedError?.response?.data?.message || "Xác thực thất bại!";
      return rejectWithValue(errorMsg);
    }
  }
);
