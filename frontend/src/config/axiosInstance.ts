/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import { updateAccessToken } from "@/lib/features/authentication/authSlice";
import { refreshToken } from "@/services/auth/authApi";

let isRefreshing = false;
let failedQueue: any[] = [];

const addQueue = (error: any, token: string | null) => {
  failedQueue.forEach((cb) => {
    if (token) {
      cb.resolve(token);
    } else {
      cb.reject(error);
    }
  });
  failedQueue = [];
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const store = require("@/lib/store").default;
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshToken();
        const newAccessToken = response.data.accessToken;
        const store = require("@/lib/store").default;
        store.dispatch(updateAccessToken(newAccessToken));
        addQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        addQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
