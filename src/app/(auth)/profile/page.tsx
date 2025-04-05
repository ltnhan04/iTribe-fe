/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Shield } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { validatePhoneNumber } from "@/utils/validate-phoneNumber";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddressSection from "@/app/(auth)/profile/components/address";
import { ProfileType } from "@/services/auth/type";
import { EditedProfile } from "@/app/(auth)/profile/type";

const UserProfile = () => {
  const { toast } = useToast();
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [editedProfile, setEditedProfile] = useState<EditedProfile>({
    isEdited: false,
    editedName: "",
    editedAddress: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Vietnam",
    },
    editedPhoneNumber: "",
  });

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        isEdited: false,
        editedName: profile.name || "",
        editedAddress: {
          street: profile.address?.street || "",
          ward: profile.address?.ward || "",
          district: profile.address?.district || "",
          city: profile.address?.city || "",
          country: profile.address?.country || "Vietnam",
        },
        editedPhoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!validatePhoneNumber(editedProfile.editedPhoneNumber)) {
      toast({
        title: "Đã xảy ra lỗi!",
        description: "Số điện thoại không hợp lệ!",
        variant: "destructive",
      });
      return;
    }

    setEditedProfile((prev) => ({ ...prev, isEdited: true }));
    try {
      const res = await updateProfile({
        name: editedProfile.editedName,
        phoneNumber: editedProfile.editedPhoneNumber,
        address: editedProfile.editedAddress,
      });
      if (res.status === 200) {
        toast({
          title: "Thay đổi thành công!",
          description: res.data.message,
          variant: "default",
        });
      }
      setEditedProfile((prev) => ({ ...prev, isEdited: false }));
    } catch (error: any) {
      toast({
        title: "Đã xảy ra lỗi!",
        description: error.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden border-0">
        <CardHeader className="bg-black text-white p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20 border-4 border-white/50 shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile?.name}`}
              />
              <AvatarFallback className="bg-blue-500 text-xl">
                {profile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {profile?.name}
              </CardTitle>
              <CardDescription className="text-blue-100 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>{profile?.role}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
                <span>
                  {profile?.active ? "Đang hoạt động" : "Không hoạt động"}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Họ và tên
                </Label>
                {editedProfile.isEdited ? (
                  <Input
                    value={editedProfile.editedName}
                    maxLength={50}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        editedName: e.target.value,
                      }))
                    }
                    className="border-gray-200 focus:border-blue-500"
                  />
                ) : (
                  <div className="text-base font-medium text-gray-900">
                    {editedProfile.editedName || "Chưa cập nhật"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Số điện thoại
                </Label>
                {editedProfile.isEdited ? (
                  <Input
                    value={editedProfile.editedPhoneNumber}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        editedPhoneNumber: e.target.value,
                      }))
                    }
                    className="border-gray-200 focus:border-blue-500"
                  />
                ) : (
                  <div className="text-base text-gray-900">
                    {profile?.phoneNumber || "Chưa cập nhật số điện thoại"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <div className="text-base text-gray-900">
                  {profile?.email || "Chưa cập nhật email"}
                </div>
              </div>
              <div className=" bg-gray-50 rounded-lg">
                <AddressSection
                  userData={profile as ProfileType}
                  setEditedProfile={setEditedProfile}
                  editedProfile={editedProfile}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 p-6 bg-gray-50">
          {editedProfile.isEdited ? (
            <>
              <Button
                onClick={handleUpdateProfile}
                className=" text-white px-6"
              >
                Lưu thay đổi
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEditedProfile((prev) => ({ ...prev, isEdited: false }))
                }
                className="border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button
              onClick={() =>
                setEditedProfile((prev) => ({ ...prev, isEdited: true }))
              }
              className=" text-white px-6"
            >
              Chỉnh sửa thông tin
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
