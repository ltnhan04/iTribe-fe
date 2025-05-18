import { axiosInstance } from "../../../config/axiosInstance";

export const refreshToken = async () => {
  return await axiosInstance.post(`/api/v1/auth/refresh-token`);
};

export const logout = async () => {
  return await axiosInstance.post(`/api/v1/auth/logout`);
};
