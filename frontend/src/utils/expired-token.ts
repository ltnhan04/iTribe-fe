"use client";
import store from "@/lib/store";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/common";

export const useAccessTokenExpired = (): boolean => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.log("Invalid access token:", error);
      return true;
    }
  }
  return true;
};
