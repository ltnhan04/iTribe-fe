"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";

import withAuth from "@/components/common/withAuth";

import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";

import { createCheckoutSession } from "@/api/services/payment/paymentApi";
import { createOrder } from "@/api/services/orders/orderApi";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import type { CartType } from "@/lib/features/cart/cartType";
import type { ErrorType } from "./type";
import { ShoppingBag, LoaderCircle } from "lucide-react";
import PromotionSection from "@/app/cart/components/promotion";
import AddressSection from "@/app/cart/components/address";
import PaymentMethodSection from "@/app/cart/components/payment-method";

const orderPlaced = "/assets/images/order-placed.jpg";

const CheckoutPage = () => {
  const { total, cart } = useAppSelector((state) => state.cart);
  const [loadingState, setLoadingState] = useState<{
    [id: string]: "isConfirming" | "isApplying" | null;
  }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    productVariants: { productVariant: string; quantity: number }[];
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
  }>({
    productVariants: cart.map((item: CartType) => ({
      productVariant: item.id,
      quantity: item.quantity,
    })),
    totalAmount: total,
    shippingAddress: "",
    paymentMethod: "",
  });
  const { toast } = useToast();

  const handleConfirmOrder = async () => {
    setLoadingState((prev) => ({ ...prev, ["confirm"]: "isConfirming" }));

    try {
      if (!checkoutData.shippingAddress) {
        return toast({
          title: "Cần thêm địa chỉ giao hàng!",
          description: "Vui lòng cập nhật địa chỉ giao hàng để tiếp tục.",
          variant: "destructive",
        });
      }
      if (!checkoutData.paymentMethod) {
        return toast({
          title: "Cần chọn phương thức thanh toán!",
          description: "Vui lòng chọn một phương thức thanh toán để hoàn tất.",
          variant: "destructive",
        });
      }

      const response = await createOrder(checkoutData);
      if (response.status === 201) {
        const { productVariants } = checkoutData;
        const orderId = response.data.order._id;
        const checkoutSession = await createCheckoutSession({
          productVariants,
          orderId,
        });

        if (checkoutSession.status === 200) {
          window.location.href = checkoutSession.data.url;
        }
        toast({
          title: "Đã đặt hàng thành công",
          description: response.data.message,
          variant: "default",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Đã xảy ra lỗi",
        description: (error as ErrorType).response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, ["confirm"]: null }));
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
        Tiến hành thanh toán
      </h1>
      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center">
                <ShoppingBag className="mr-2 h-6 w-6 text-primary" />
                Tổng quan đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item: CartType) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-2 md:space-x-4 p-2 rounded-lg bg-gray-50 shadow-sm"
                >
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-sm md:text-base font-medium">
                        {item.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-base md:text-lg">
                  <span>Tổng tiền</span>
                  <span>{checkoutData.totalAmount.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <AddressSection setCheckoutData={setCheckoutData} />
          <PromotionSection
            loadingState={loadingState}
            setLoadingState={setLoadingState}
            setCheckoutData={setCheckoutData}
            totalAmount={checkoutData.totalAmount}
          />
        </div>

        <div>
          <PaymentMethodSection
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />
          <Card className="mt-6 md:mt-8">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Xác nhận thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-between">
                <div className="w-full max-w-[400px] h-[150px] md:h-[200px] relative mb-4">
                  <Image
                    src={orderPlaced}
                    alt="order placed"
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                    className="object-contain"
                  />
                </div>
                <div className="mb-4 text-sm md:text-base text-gray-600 text-center">
                  Vui lòng kiểm tra lại thông tin đơn hàng của bạn trước khi xác
                  nhận.
                </div>
              </div>
              <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full text-sm md:text-base"
                    disabled={loadingState["apply"] === "isApplying"}
                    variant={"default"}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Đặt hàng
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] md:max-w-[500px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg md:text-xl">
                      Xác nhận đặt hàng
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm md:text-base">
                      Bạn có chắc chắn muốn đặt hàng không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={loadingState["confirm"] === "isConfirming"}
                      className="text-sm md:text-base"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={loadingState["confirm"] === "isConfirming"}
                      className="text-white text-sm md:text-base"
                    >
                      {loadingState["confirm"] === "isConfirming" ? (
                        <>
                          <LoaderCircle className="animate-spin" />{" "}
                          <div>Chờ tí nhé...</div>
                        </>
                      ) : (
                        "Xác nhận"
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CheckoutPage);
