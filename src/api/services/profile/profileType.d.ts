export interface ProvinceType {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  districts: DistrictType[];
}

export interface DistrictType {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: WardType[];
}

export interface WardType {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}
