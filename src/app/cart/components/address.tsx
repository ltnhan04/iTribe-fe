"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin, MapPinHouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressProps {
  setCheckoutData: React.Dispatch<
    React.SetStateAction<{
      variants: { variant: string; quantity: number }[];
      totalAmount: number;
      shippingAddress: string;
      paymentMethod: string;
    }>
  >;
}

const AddressSection: React.FC<AddressProps> = ({ setCheckoutData }) => {
  const { profile, isLoading, error } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.address) {
      const { street, ward, city, country } = profile.address;
      if (street && ward && city) {
        const address = `${street}, ${ward}, ${city}, ${country}`;
        setCheckoutData((prev) => ({
          ...prev,
          shippingAddress: address,
        }));
      } else {
        toast({
          title: "Cần cập nhật địa chỉ đầy đủ!",
          description: "Vui lòng cập nhật đầy đủ địa chỉ để tiếp tục.",
          variant: "destructive",
        });
      }
    }
  }, [profile, setCheckoutData, toast]);

  return (
    <Card className="mt-6 md:mt-8">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center justify-between">
          <div className="flex items-center ">
            <MapPin className="mr-2 h-6 w-6 text-primary" />
            Địa chỉ giao hàng
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"/profile"}>
                  <MapPinHouse className=" h-6 w-6 text-primary cursor-pointer" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thay đổi địa chỉ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-gray-600">
          {isLoading
            ? "Đang tải..."
            : error
            ? "Không thể tải địa chỉ."
            : profile?.address
            ? `${profile.address.street}, ${profile.address.ward}, ${profile.address.city}, ${profile.address.country}`
            : "Vui lòng thêm địa chỉ của bạn!"}
        </p>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
