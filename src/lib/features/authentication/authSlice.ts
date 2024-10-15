import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignUpState, LoginState, VerifySignUpState } from "./authType";
import {
  loginThunk,
  signUpThunk,
  verifySignUpThunk,
} from "@/lib/features/authentication/authThunk";

export interface AuthState {
  login: {
    loginState: { message: string };
    isLoading: boolean;
    error: string;
  };
  signUp: {
    signUpState: SignUpState;
    isLoading: boolean;
    error: string;
  };
  verifySignUp: {
    verifySignUpState: { message: string };
    isLoading: boolean;
    error: string;
  };
  accessToken: string;
}
const initialState: AuthState = {
  login: {
    loginState: {
      message: "",
    },
    isLoading: false,
    error: "",
  },
  signUp: {
    signUpState: {
      email: "",
      message: "",
    },
    isLoading: false,
    error: "",
  },
  verifySignUp: {
    verifySignUpState: {
      message: "",
    },
    isLoading: false,
    error: "",
  },
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage: (
      state,
      action: PayloadAction<"login" | "signUp" | "verifySignUp">
    ) => {
      if (action.payload === "login") {
        state.login.loginState.message = "";
      } else if (action.payload === "signUp") {
        state.signUp.signUpState.message = "";
      } else if (action.payload === "verifySignUp") {
        state.verifySignUp.verifySignUpState.message = "";
      }
    },
    clearError: (
      state,
      action: PayloadAction<"login" | "signUp" | "verifySignUp">
    ) => {
      if (action.payload === "login") {
        state.login.error = "";
      } else if (action.payload === "signUp") {
        state.signUp.error = "";
      } else if (action.payload === "verifySignUp") {
        state.verifySignUp.error = "";
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      const newAccessToken = action.payload;
      state.accessToken = newAccessToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.login.isLoading = true;
      state.login.error = "";
    });
    builder.addCase(
      loginThunk.fulfilled,
      (state, action: PayloadAction<LoginState>) => {
        state.login.isLoading = false;
        const { accessToken, message } = action.payload;
        state.login.loginState.message = message;
        state.accessToken = accessToken;
        state.login.error = "";
      }
    );
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.login.isLoading = false;
      state.login.error = action.payload
        ? (action.payload as string)
        : action.error.message || "Có lỗi xảy ra!";
    });

    builder.addCase(signUpThunk.pending, (state) => {
      state.signUp.isLoading = true;
      state.signUp.error = "";
    });
    builder.addCase(
      signUpThunk.fulfilled,
      (state, action: PayloadAction<SignUpState>) => {
        state.signUp.isLoading = false;
        state.signUp.signUpState = action.payload;
        state.signUp.error = "";
      }
    );
    builder.addCase(signUpThunk.rejected, (state, action) => {
      state.signUp.isLoading = false;
      state.signUp.error = action.payload
        ? (action.payload as string)
        : action.error.message || "Có lỗi xảy ra!";
    });
    builder.addCase(verifySignUpThunk.pending, (state) => {
      state.verifySignUp.isLoading = true;
      state.verifySignUp.error = "";
    });
    builder.addCase(
      verifySignUpThunk.fulfilled,
      (state, action: PayloadAction<VerifySignUpState>) => {
        state.verifySignUp.isLoading = false;
        const { message, accessToken } = action.payload;
        state.verifySignUp.verifySignUpState.message = message;
        state.accessToken = accessToken;
        state.verifySignUp.error = "";
      }
    );
    builder.addCase(verifySignUpThunk.rejected, (state, action) => {
      state.verifySignUp.isLoading = false;
      state.verifySignUp.error = action.payload
        ? (action.payload as string)
        : action.error.message || "Có lỗi xảy ra!";
    });
  },
});
export const { clearMessage, clearError, updateAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
