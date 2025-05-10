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
import { ProfileType } from "@/types/auth";
import { EditedProfile } from "@/types/profile";

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border-0 transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
          <div className="flex items-center space-x-8">
            <Avatar className="w-24 h-24 border-4 border-white/30 shadow-xl transition-transform duration-300 hover:scale-105">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile?.name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold">
                {profile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {profile?.name}
              </CardTitle>
              <CardDescription className="text-blue-100/90 flex items-center space-x-2 text-lg">
                <Shield className="w-5 h-5" />
                <span className="font-medium">{profile?.role}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="grid gap-8 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-600 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
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
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-12 text-lg"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900 py-2 px-3 rounded-md bg-gray-50">
                    {editedProfile.editedName || "Chưa cập nhật"}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-600 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-500" />
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
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-12 text-lg"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="text-lg text-gray-900 py-2 px-3 rounded-md bg-gray-50">
                    {profile?.phoneNumber || "Chưa cập nhật số điện thoại"}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-600 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-500" />
                  Email
                </Label>
                <div className="text-lg text-gray-900 py-2 px-3 rounded-md bg-gray-50">
                  {profile?.email || "Chưa cập nhật email"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <AddressSection
                  userData={profile as ProfileType}
                  setEditedProfile={setEditedProfile}
                  editedProfile={editedProfile}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 p-8 bg-gray-50 border-t border-gray-100">
          {editedProfile.isEdited ? (
            <>
              <Button
                onClick={handleUpdateProfile}
                className="bg-primary text-white px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300"
              >
                Lưu thay đổi
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEditedProfile((prev) => ({ ...prev, isEdited: false }))
                }
                className="border-gray-300 hover:bg-gray-100 px-8 py-6 text-lg font-semibold transition-all duration-300"
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button
              onClick={() =>
                setEditedProfile((prev) => ({ ...prev, isEdited: true }))
              }
              className=" text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl bg-primary transition-all duration-300"
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
