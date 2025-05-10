import { axiosInstance } from "@/config/axiosInstance";
import { ProvinceType, DistrictType } from "@/types/profile";

export const getProvinces = async () => {
  const res = await axiosInstance.get<ProvinceType[]>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/provinces`
  );
  return res.data;
};
export const getDistricts = async (code: number) => {
  const res = await axiosInstance.get<ProvinceType>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/districts/${code}`
  );
  return res.data.districts;
};

export const getWards = async (code: number) => {
  const res = await axiosInstance.get<DistrictType>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/wards/${code}`
  );
  return res.data.wards;
};
