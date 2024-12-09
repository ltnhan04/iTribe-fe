"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import Image from "next/image";

import withAuth from "@/components/common/withAuth";

import { ShoppingBag, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { clearCart } from "@/lib/features/cart/cartSlice";
import type { CartType } from "@/lib/features/cart/cartType";

import { applyPromotion } from "@/api/services/promotions/promotionApi";
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

import type { ErrorType } from "./type";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const [totalAmount, setTotalAmount] = useState(
    useAppSelector((state) => state.cart.total)
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const applyAPromotion = async () => {
    setIsLoading(true);
    try {
      const response = await applyPromotion({
        code: promoCode,
        totalAmount: totalAmount,
      });
      const data = response.data;
      setTotalAmount(data.discountedAmount);
      toast({
        title: "Sử dụng khuyến mãi thành công",
        description: `Giảm giá còn ${data.discountAmount} VND cho đơn hàng.`,
        variant: "default",
      });
    } catch (error: unknown) {
      toast({
        title: "Đã xảy ra lỗi",
        description: (error as ErrorType).response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    const checkoutData = {
      productVariants: cart.map((item: CartType) => ({
        productVariant: item.id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: "123 Example St, City, Country",
      paymentMethod: selectedPaymentMethod,
    };

    try {
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
          dispatch(clearCart());
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
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tiến hành thanh toán
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item: CartType) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-4 p-2 rounded-lg bg-gray-50 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Tổng tiền</span>
                  <span>{totalAmount.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">123 Example St, City, Country</p>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  disabled={isLoading}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  disabled={isLoading}
                  onClick={applyAPromotion}
                  className="bg-blue transition-colors duration-300 ease-in-out hover:bg-blue/60 text-white"
                >
                  Sử dụng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-4"
              >
                {[
                  {
                    id: "pointer-wallet",
                    label: "Pointer Wallet",
                    icon: Wallet,
                  },
                  { id: "stripe", label: "Stripe", icon: CreditCard },
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg ${
                      selectedPaymentMethod === method.id
                        ? "border-blue"
                        : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <method.icon className="h-6 w-6 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {method.label}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Xác nhận thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-gray-600">
                Vui lòng kiểm tra lại thông tin đơn hàng của bạn trước khi xác
                nhận.
              </div>
              <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isLoading}
                    className="w-full transition-colors duration-300 ease-in-out bg-blue hover:bg-blue/60 text-white py-3 font-bold"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Đặt hàng
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận đặt hàng</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn đặt hàng không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={isLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={isLoading}
                      className="text-white"
                    >
                      Xác nhận
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
