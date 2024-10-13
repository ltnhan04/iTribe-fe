import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignUpState, LoginState, VerifySignUpState } from "./authType";
import {
  loginThunk,
  signUpThunk,
  verifySignUpThunk,
} from "@/lib/features/authentication/authThunk";

export interface AuthState {
  login: {
    loginState: LoginState;
    isLoading: boolean;
    error: string;
  };
  signUp: {
    signUpState: SignUpState;
    isLoading: boolean;
    error: string;
  };
  verifySignUp: {
    verifySignUpState: VerifySignUpState;
    isLoading: boolean;
    error: string;
  };
}
const initialState: AuthState = {
  login: {
    loginState: {
      accessToken: "",
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
      accessToken: "",
      message: "",
    },
    isLoading: false,
    error: "",
  },
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
        state.login.loginState = action.payload;
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
        state.verifySignUp.verifySignUpState = action.payload;
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
export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
