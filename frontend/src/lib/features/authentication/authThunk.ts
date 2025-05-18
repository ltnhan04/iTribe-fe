import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, signUp, verifySignUp } from "@/services/auth/authApi";
import { LoginType, SignUpType, VerifySignUpType } from "@/types/auth";
import { ErrorType as ErrorResponse } from "@/types/common";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    {
      user,
      router,
    }: { user: LoginType; router: { push: (path: string) => void } },
    { rejectWithValue }
  ) => {
    try {
      const response = await login(user);
      if (response.status === 200) {
        router.push("/iphone");
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
      router,
    }: {
      user: SignUpType;
      router: { push: (path: string) => void };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await signUp(user);
      if (response.status === 200) {
        router.push("/register/verify");
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
      router,
    }: { verify: VerifySignUpType; router: { push: (path: string) => void } },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifySignUp(verify);
      if (response.status === 200) {
        router.push("/iphone");
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
