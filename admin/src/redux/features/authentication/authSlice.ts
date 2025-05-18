import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk } from "./authActions";
import type { LoginStateFulfilled } from "../../../types/auth";

export interface AuthState {
  login: {
    loginState: { message: string };
    isLoading: boolean;
    error: string;
  };
  accessToken: string;
  name: string;
}

const initialState: AuthState = {
  login: {
    loginState: { message: "" },
    isLoading: false,
    error: "",
  },
  accessToken: "",
  name: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.login.loginState.message = "";
    },
    clearError: (state) => {
      state.login.error = "";
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = "";
      state.name = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.login.isLoading = true;
        state.login.error = "";
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<LoginStateFulfilled>) => {
          const { accessToken, message, name } = action.payload;
          state.login.isLoading = false;
          state.login.loginState.message = message;
          state.accessToken = accessToken;
          state.name = name;
          state.login.error = "";
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.error = action.payload
          ? (action.payload as string)
          : action.error.message || "An error occurred!";
      });
  },
});

export const { clearMessage, clearError, updateAccessToken, clearAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
