import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin, MapPinHouse } from "lucide-react";

import type { ErrorType, UserAddress } from "@/app/cart/checkout/type";
import { getProfile } from "@/api/services/auth/authApi";

interface AddressProps {
  setCheckoutData: React.Dispatch<
    React.SetStateAction<{
      productVariants: { productVariant: string; quantity: number }[];
      totalAmount: number;
      shippingAddress: string;
      paymentMethod: string;
    }>
  >;
}

const AddressSection: React.FC<AddressProps> = ({ setCheckoutData }) => {
  const [userAddress, setUserAddress] = useState<UserAddress | undefined>(
    undefined
  );
  const [errMsg, setErrMsg] = useState("Vui lòng thêm địa chỉ của bạn!");

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await getProfile();
        if (res.status === 200) {
          setUserAddress(res.data.address);
          if (
            userAddress &&
            userAddress.street &&
            userAddress.ward &&
            userAddress.city
          ) {
            const address =
              userAddress?.street +
              ", " +
              userAddress?.ward +
              ", " +
              userAddress?.city +
              ", " +
              userAddress?.country;
            setCheckoutData((prev) => ({
              ...prev,
              shippingAddress: address,
            }));
          }
        } else {
          setErrMsg("Địa chỉ của bạn chưa được cập nhật!");
        }
      } catch (error) {
        setErrMsg((error as ErrorType).response.data.message);
      }
    };
    getAddress();
  }, [setCheckoutData, userAddress]);

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
          {!userAddress ||
          (!userAddress.street && !userAddress.ward && !userAddress.city)
            ? errMsg
            : userAddress?.street +
              ", " +
              userAddress?.ward +
              ", " +
              userAddress?.city +
              ", " +
              userAddress?.country}
        </p>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
