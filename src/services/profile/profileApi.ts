import { axiosInstance } from "@/config/axiosInstance";
import { ProvinceType, DistrictType } from "@/api/services/profile/profileType";

export const getProvinces = async () => {
  return await axiosInstance.get<ProvinceType[]>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/provinces`
  );
};
export const getDistricts = async (code: number) => {
  return await axiosInstance.get<ProvinceType>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/districts/${code}`
  );
};

export const getWards = async (code: number) => {
  return await axiosInstance.get<DistrictType>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/wards/${code}`
  );
};
