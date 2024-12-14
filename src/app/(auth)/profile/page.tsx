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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Package,
} from "lucide-react";
import { getProfile, updateProfile } from "@/api/services/auth/authApi";
import type {
  ProfileType,
  EditedProfile,
  ErrorType,
} from "@/app/(auth)/profile/type";
import withAuth from "@/components/common/withAuth";

import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-day";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddressSection from "@/app/(auth)/profile/components/address";

const UserProfile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<ProfileType | null>(null);
  const [editedProfile, setEditedProfile] = useState<EditedProfile>({
    isEdited: false,
    editedName: userData?.name || "",
    editedAddress: {
      street: userData?.address?.street || "",
      ward: userData?.address?.ward || "",
      district: userData?.address?.district || "",
      city: userData?.address?.city || "",
      country: userData?.address?.country || "Vietnam",
    },
    editedPhoneNumber: userData?.phoneNumber || "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        setUserData(response.data);

        setEditedProfile((prev) => ({
          ...prev,
          editedName: response.data.name || "",
          editedAddress: {
            street: response.data.address?.street || "",
            ward: response.data.address?.ward || "",
            district: response.data.address?.district || "",
            city: response.data.address?.city || "",
            country: response.data.address?.country || "Vietnam",
          },
          editedPhoneNumber: response.data.phoneNumber || "",
        }));
      } catch (error) {
        toast({
          title: "Đã xảy ra lỗi!",
          description: (error as ErrorType).response.data.message,
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const handleUpdateProfile = async () => {
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
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi!",
        description: (error as ErrorType).response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.name}`}
              />
              <AvatarFallback>
                {userData?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">
                {userData?.name}
              </CardTitle>
              <CardDescription className="text-gray-200">
                {userData?.role} | {userData?.active ? "Active" : "Inactive"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="text-lg">
                <User className="w-5 h-5 mr-2" />
                Thông tin
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-lg">
                <Package className="w-5 h-5 mr-2" />
                Lịch sử đặt hàng
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <User className="w-6 h-6 text-gray-500" />
                  <div className="flex-grow">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-500"
                    >
                      Tên
                    </Label>
                    {editedProfile.isEdited ? (
                      <Input
                        id="name"
                        value={editedProfile.editedName}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            editedName: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 text-lg">
                        {editedProfile.editedName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-gray-500" />
                  <div className="flex-grow">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-500"
                    >
                      Số điện thoại
                    </Label>
                    {editedProfile.isEdited ? (
                      <Input
                        id="phoneNumber"
                        value={editedProfile.editedPhoneNumber}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            editedPhoneNumber: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 text-sm">
                        {userData && userData.phoneNumber
                          ? userData.phoneNumber
                          : "Vui lòng thêm số điện thoại"}
                      </div>
                    )}
                  </div>
                </div>
                <AddressSection
                  userData={userData}
                  setEditedProfile={setEditedProfile}
                  editedProfile={editedProfile}
                />
              </div>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {userData &&
                  userData.orderHistory.map((order, index) => (
                    <AccordionItem key={order._id} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between w-full items-center">
                          <span className="font-medium">
                            Đơn hàng #{order._id.slice(-6)}
                          </span>
                          <Badge
                            variant={
                              order.status === "pending"
                                ? "default"
                                : order.status === "processing"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Ngày:</span>{" "}
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Tổng tiền:</span>{" "}
                            {formatCurrency(order.totalAmount)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">
                              Địa chỉ giao hàng:
                            </span>{" "}
                            {order.shippingAddress}
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">
                              Phương thức thanh toán:
                            </span>{" "}
                            {order.paymentMethod}
                          </div>
                          <div>
                            <span className="font-medium">Sản phẩm:</span>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                              {order.productVariants &&
                                order.productVariants
                                  .filter(
                                    (item) => item.productVariant !== null
                                  )
                                  .map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-sm">
                                      {item.productVariant.name} -{" "}
                                      {item.productVariant.color.colorName} (
                                      {item.productVariant.storage}GB) x{" "}
                                      {item.quantity} -{" "}
                                      {formatCurrency(
                                        item.productVariant.price *
                                          item.quantity
                                      )}
                                    </li>
                                  ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 mt-6">
          {editedProfile.isEdited ? (
            <>
              <Button
                onClick={handleUpdateProfile}
                className="bg-blue hover:bg-blue/80"
              >
                Lưu thay đổi
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEditedProfile((prev) => ({ ...prev, isEdited: false }))
                }
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button
              onClick={() =>
                setEditedProfile((prev) => ({ ...prev, isEdited: true }))
              }
              variant={"default"}
            >
              Chỉnh sửa thông tin
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default withAuth(UserProfile);
