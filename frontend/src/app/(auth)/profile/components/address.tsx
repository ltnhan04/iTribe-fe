import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useLocation";

import { EditedProfile, ProfileType } from "@/types/profile";

interface AddressProps {
  setEditedProfile: React.Dispatch<React.SetStateAction<EditedProfile>>;
  editedProfile: EditedProfile;
  userData: ProfileType | null;
}

const AddressSection: React.FC<AddressProps> = ({
  setEditedProfile,
  editedProfile,
  userData,
}) => {
  const [selectedValue, setSelectedValue] = useState({
    provinceCode: "",
    districtCode: "",
    wardCode: "",
  });

  const {
    data: provinces = [],
    isLoading: loadingProvinces,
    error: errorProvinces,
  } = useProvinces();
  const {
    data: districts = [],
    isLoading: loadingDistricts,
    error: errorDistricts,
  } = useDistricts(Number(selectedValue.provinceCode));
  const {
    data: wards = [],
    isLoading: loadingWards,
    error: errorWards,
  } = useWards(Number(selectedValue.districtCode));

  const updateAddress = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      editedAddress: {
        ...prev.editedAddress,
        [field]: value,
      },
    }));
  };

  const handleProvinceChange = (value: string) => {
    setSelectedValue({ provinceCode: value, districtCode: "", wardCode: "" });
    updateAddress(
      "city",
      provinces.find((p) => p.code === Number(value))?.name || ""
    );
    updateAddress("district", "");
    updateAddress("ward", "");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedValue((prev) => ({
      ...prev,
      districtCode: value,
      wardCode: "",
    }));
    updateAddress(
      "district",
      districts.find((d) => d.code === Number(value))?.name || ""
    );
    updateAddress("ward", "");
  };

  const handleWardChange = (value: string) => {
    setSelectedValue((prev) => ({ ...prev, wardCode: value }));
    updateAddress(
      "ward",
      wards.find((w) => w.code === Number(value))?.name || ""
    );
  };

  return (
    <div className="flex items-start space-x-4">
      <MapPin className="w-6 h-6 text-gray-500 mt-1" />
      <div className="flex-grow">
        <Label htmlFor="address" className="text-sm font-medium text-gray-500">
          Địa chỉ
        </Label>
        {editedProfile.isEdited ? (
          <>
            <Select
              onValueChange={handleProvinceChange}
              value={selectedValue.provinceCode}
              disabled={loadingProvinces}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingProvinces ? "Đang tải..." : "Chọn Tỉnh/Thành phố"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem
                    key={province.code}
                    value={province.code.toString()}
                  >
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorProvinces && (
              <p className="text-red-500 text-sm">{errorProvinces.message}</p>
            )}

            <Select
              onValueChange={handleDistrictChange}
              value={selectedValue.districtCode}
              disabled={!selectedValue.provinceCode || loadingDistricts}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingDistricts ? "Đang tải..." : "Chọn Quận/Huyện"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem
                    key={district.code}
                    value={district.code.toString()}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorDistricts && (
              <p className="text-red-500 text-sm">{errorDistricts.message}</p>
            )}

            <Select
              onValueChange={handleWardChange}
              value={selectedValue.wardCode}
              disabled={!selectedValue.districtCode || loadingWards}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loadingWards ? "Đang tải..." : "Chọn Phường/Xã"}
                />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.code.toString()}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorWards && (
              <p className="text-red-500 text-sm">{errorWards.message}</p>
            )}

            <Input
              id="street"
              maxLength={100}
              placeholder="Số nhà, Đường"
              value={editedProfile.editedAddress.street}
              onChange={(e) => updateAddress("street", e.target.value)}
            />
          </>
        ) : (
          <div className="text-sm">
            {userData?.address?.street ? (
              <>
                {userData.address.street}, {userData.address.ward},{" "}
                {userData.address.district}, {userData.address.city},{" "}
                {userData.address.country}
              </>
            ) : (
              "Vui lòng thêm địa chỉ"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSection;
