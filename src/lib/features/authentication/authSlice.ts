// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User, ErrorResponse } from "./authType";

// export interface AuthState {
//   login: {
//     accessToken: string;
//     message: string;
//     isLoading: boolean;
//     error: string;
//   };
//   signUp: {
//     signUp: User;
//     isLoading: boolean;
//     error: string;
//   };
// }
// const initialState: AuthState = {
//   login: {
//     accessToken: "",
//     message: "",
//     isLoading: false,
//     error: "",
//   },
//   signUp: {
//     signUp: {
//       email: "",
//       otp: "",
//       message: "",
//     },
//     isLoading: false,
//     error: "",
//   },
// };

// const authSlice = createSlice({ name: "auth", initialState, reducers: {}, extraReducers:(builder)=>{
//   builder.addCase()
// } });
