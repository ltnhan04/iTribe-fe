import { useQuery } from "@tanstack/react-query";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "@/services/profile/profileApi";
import { ProvinceType, DistrictType, WardType } from "@/types/profile";

export const useProvinces = () => {
  return useQuery<ProvinceType[]>({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });
};

export const useDistricts = (provinceCode?: number) => {
  return useQuery<DistrictType[]>({
    queryKey: ["districts", provinceCode],
    queryFn: () =>
      provinceCode ? getDistricts(provinceCode) : Promise.resolve([]),
    enabled: !!provinceCode,
  });
};

export const useWards = (districtCode?: number) => {
  return useQuery<WardType[]>({
    queryKey: ["wards", districtCode],
    queryFn: () =>
      districtCode ? getWards(districtCode) : Promise.resolve([]),
    enabled: !!districtCode,
  });
};
