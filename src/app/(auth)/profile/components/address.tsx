import React, { useState, useEffect } from "react";
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
import {
  getProvinces,
  getDistricts,
  getWards,
} from "@/services/profile/profileApi";
import type {
  ProvinceType,
  DistrictType,
  WardType,
} from "@/services/profile/profileType";
import type { EditedProfile, ProfileType } from "@/app/(auth)/profile/type";

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
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [wards, setWards] = useState<WardType[]>([]);
  const [loading, setLoading] = useState({
    province: false,
    district: false,
    ward: false,
  });
  const [error, setError] = useState<string | null>(null);

  const [selectedValue, setSelectedValue] = useState({
    provinceCode: "",
    districtCode: "",
    wardCode: "",
  });

  const updateAddress = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      editedAddress: {
        ...prev.editedAddress,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading((prev) => ({ ...prev, province: true }));
      setError(null);
      try {
        const response = await getProvinces();
        setProvinces(response.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoading((prev) => ({ ...prev, province: false }));
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedValue.provinceCode) return;

    const fetchDistricts = async () => {
      setLoading((prev) => ({ ...prev, district: true }));
      setError(null);
      try {
        const response = await getDistricts(Number(selectedValue.provinceCode));
        setDistricts(response.data.districts || []);
        setWards([]);
        setSelectedValue((prev) => ({
          ...prev,
          districtCode: "",
          wardCode: "",
        }));
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError("Không thể tải danh sách quận/huyện");
      } finally {
        setLoading((prev) => ({ ...prev, district: false }));
      }
    };
    fetchDistricts();
  }, [selectedValue.provinceCode]);

  useEffect(() => {
    if (!selectedValue.districtCode) return;

    const fetchWards = async () => {
      setLoading((prev) => ({ ...prev, ward: true }));
      setError(null);
      try {
        const response = await getWards(Number(selectedValue.districtCode));
        setWards(response.data.wards || []);
        setSelectedValue((prev) => ({ ...prev, wardCode: "" }));
      } catch (error) {
        console.error("Error fetching wards:", error);
        setError("Không thể tải danh sách phường/xã");
      } finally {
        setLoading((prev) => ({ ...prev, ward: false }));
      }
    };
    fetchWards();
  }, [selectedValue.districtCode]);

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
      <div className="flex-grow ">
        <Label htmlFor="address" className="text-sm font-medium text-gray-500">
          Địa chỉ
        </Label>
        {editedProfile.isEdited ? (
          <>
            <Select
              onValueChange={handleProvinceChange}
              value={selectedValue.provinceCode}
              disabled={loading.province}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loading.province ? "Đang tải..." : "Chọn Tỉnh/Thành phố"
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

            <Select
              onValueChange={handleDistrictChange}
              value={selectedValue.districtCode}
              disabled={!selectedValue.provinceCode || loading.district}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loading.district ? "Đang tải..." : "Chọn Quận/Huyện"
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

            <Select
              onValueChange={handleWardChange}
              value={selectedValue.wardCode}
              disabled={!selectedValue.districtCode || loading.ward}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loading.ward ? "Đang tải..." : "Chọn Phường/Xã"}
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default AddressSection;
