/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import withAuth from "@/components/common/withAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";
import { useOrders } from "@/hooks/useOrders";
import {
  createCheckoutSession,
  createMomoPayment,
} from "@/services/payment/paymentApi";
import { useShippingFee, useShippingMethods } from "@/hooks/useShippingMethod";
import { ShoppingBag, LoaderCircle, Truck } from "lucide-react";
import PromotionSection from "@/app/cart/components/promotion";
import AddressSection from "@/app/cart/components/address";
import PaymentMethodSection from "@/app/cart/components/payment-method";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ShippingMethod {
  _id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const orderPlaced = "/assets/images/order-placed.jpg";

const CheckoutPage = () => {
  const { total, cart } = useAppSelector((state) => state.cart);
  const [loadingState, setLoadingState] = useState<{
    [id: string]: "isConfirming" | "isApplying" | null;
  }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [checkoutData, setCheckoutData] = useState<{
    variants: { variant: string; quantity: number }[];
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    shippingMethod?: string;
  }>({
    variants: cart.map((item) => ({
      variant: item.id,
      quantity: item.quantity,
    })),
    totalAmount: total,
    shippingAddress: "",
    paymentMethod: "",
  });

  const { toast } = useToast();
  const { createOrder, isLoading: isCreatingOrder } = useOrders();
  const { data: shippingMethods, isLoading: isLoadingMethods } =
    useShippingMethods("TP Hồ Chí Minh");
  const { data: shippingFee } = useShippingFee(
    selectedShippingMethod,
    "TP Hồ Chí Minh"
  );
  useEffect(() => {
    if (
      shippingMethods?.data &&
      shippingMethods.data.length > 0 &&
      !selectedShippingMethod
    ) {
      const fastMethod = shippingMethods.data.find(
        (method: ShippingMethod) => method.name === "Nhanh"
      );
      if (fastMethod) {
        setSelectedShippingMethod(fastMethod._id);
        setCheckoutData((prev) => ({
          ...prev,
          shippingMethod: fastMethod._id,
          totalAmount: total,
        }));
      }
    }
  }, [shippingMethods, selectedShippingMethod, total]);

  const handleShippingMethodChange = (value: string) => {
    setSelectedShippingMethod(value);
    setCheckoutData((prev) => ({
      ...prev,
      shippingMethod: value,
      totalAmount: total,
    }));
  };

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
      if (!checkoutData.shippingMethod) {
        return toast({
          title: "Cần chọn phương thức vận chuyển!",
          description: "Vui lòng chọn một phương thức vận chuyển để tiếp tục.",
          variant: "destructive",
        });
      }

      const response = await createOrder(checkoutData);
      if (response.status === 201) {
        const { variants } = checkoutData;
        const orderId = response.data.order._id;

        if (checkoutData.paymentMethod === "stripe") {
          const checkoutSession = await createCheckoutSession({
            variants,
            orderId,
          });

          if (checkoutSession.status === 200) {
            window.location.href = checkoutSession.data.url;
          }
        } else if (checkoutData.paymentMethod === "momo") {
          const momoResponse = await createMomoPayment({
            orderId,
            amount: finalTotal.toString(),
            orderInfo: "Thanh toán đơn hàng iTribe",
          });

          if (momoResponse.status === 200) {
            window.location.href = momoResponse.data.url.url;
          }
        } else if (checkoutData.paymentMethod === "ship-cod") {
          window.location.href = `/checkout/success?orderId=${orderId}`;
        }

        toast({
          title: "Đã đặt hàng thành công",
          description: response.data.message,
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Đã xảy ra lỗi",
        description: "Có lỗi trong quá trình đặt hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, ["confirm"]: null }));
      setShowConfirmDialog(false);
    }
  };

  const selectedMethod = shippingMethods?.data?.find(
    (method: ShippingMethod) => method._id === selectedShippingMethod
  );

  const shippingCost = shippingFee?.data?.fee || 0;
  const finalTotal = total + shippingCost;

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
              {cart.map((item) => (
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
                <div className="flex justify-between items-center text-sm md:text-base mb-2">
                  <span>Tạm tính</span>
                  <span>{checkoutData.totalAmount.toLocaleString()} VND</span>
                </div>
                {selectedMethod && (
                  <div className="flex justify-between items-center text-sm md:text-base mb-2">
                    <span>Phí vận chuyển ({selectedMethod.name})</span>
                    <span>{shippingCost.toLocaleString()} VND</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-base md:text-lg mt-4 pt-4 border-t">
                  <span>Tổng tiền</span>
                  <span>{finalTotal.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center">
                <Truck className="mr-2 h-6 w-6 text-primary" />
                Phương thức vận chuyển
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMethods ? (
                <div className="flex items-center justify-center py-4">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <RadioGroup
                  value={selectedShippingMethod}
                  onValueChange={handleShippingMethodChange}
                  className="space-y-3"
                >
                  {shippingMethods?.data?.map((method: ShippingMethod) => (
                    <div
                      key={method._id}
                      className="flex items-center space-x-3 p-4 rounded-lg border bg-gray-50"
                    >
                      <RadioGroupItem value={method._id} id={method._id} />
                      <Label
                        htmlFor={method._id}
                        className="flex flex-1 justify-between items-center cursor-pointer"
                      >
                        <span className="font-medium">{method.name}</span>
                        <span className="text-gray-600">
                          {(method.basePrice || 0).toLocaleString()} VND
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
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
                    disabled={isCreatingOrder}
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
                      disabled={isCreatingOrder}
                      className="text-sm md:text-base"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={isCreatingOrder}
                      className="text-white text-sm md:text-base"
                    >
                      {isCreatingOrder ? (
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
