export interface ProfileType {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: UserAddress;
  password: string;
  role: string;
  active: boolean;
  orderHistory: OrderHistory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderHistory {
  _id: string;
  user: string;
  productVariants: ProductVariant[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products?: any[];
}

export interface ProductVariant {
  productVariant: ProductVariant2;
  quantity: number;
  _id: string;
}

export interface ProductVariant2 {
  color: Color;
  _id: string;
  name: string;
  storage: string;
  price: number;
}

export interface Color {
  colorName: string;
  colorCode: string;
}
export interface UserAddress {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  country: string;
}

export interface EditedProfile {
  isEdited: boolean;
  editedName: string;
  editedAddress: UserAddress;
  editedPhoneNumber: string;
}

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
