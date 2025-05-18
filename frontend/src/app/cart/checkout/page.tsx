/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import withAuth from "@/components/common/withAuth";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";
import { useOrders } from "@/hooks/useOrders";
import {
  createCheckoutSession,
  createMomoPayment,
} from "@/services/payment/paymentApi";
import { useShippingFee, useShippingMethods } from "@/hooks/useShippingMethod";
import PromotionSection from "@/app/cart/components/promotion";
import AddressSection from "@/app/cart/components/address";
import PaymentMethodSection from "@/app/cart/components/payment-method";
import { useProfile } from "@/hooks/useProfile";
import OrderSummary from "./components/OrderSummary";
import ShippingMethodSection from "./components/ShippingMethodSection";
import BreadCrumb from "./components/bread-crumb";
import { ShippingMethod } from "@/types/checkout";

const CheckoutPage = () => {
  const { total, cart } = useAppSelector((state) => state.cart);
  const [loadingState, setLoadingState] = useState<{
    [id: string]: "isConfirming" | "isApplying" | null;
  }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
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

  useEffect(() => {
    if (discountedTotal !== null) {
      setCheckoutData((prev) => ({
        ...prev,
        totalAmount: discountedTotal,
      }));
      setDiscountAmount(total - discountedTotal);
    } else {
      setCheckoutData((prev) => ({
        ...prev,
        totalAmount: total,
      }));
      setDiscountAmount(null);
    }
  }, [discountedTotal, total]);

  const { toast } = useToast();
  const { createOrder, isLoading: isCreatingOrder } = useOrders();
  const { profile } = useProfile();
  const city = profile?.address?.city?.replace("Thành phố", "").trim();
  const { data: shippingMethods, isLoading: isLoadingMethods } =
    useShippingMethods(city as string);
  const { data: shippingFee } = useShippingFee(
    selectedShippingMethod,
    city as string
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

      const response = await createOrder({
        ...checkoutData,
        totalAmount: discountedTotal !== null ? discountedTotal : total,
      });
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
  const finalTotal =
    (discountedTotal !== null ? discountedTotal : total) + shippingCost;

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <BreadCrumb />
      <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center">
        Thanh Toán
      </h1>

      <div className="grid gap-8 md:gap-12 md:grid-cols-12">
        <div className="md:col-span-7 space-y-8">
          <AddressSection setCheckoutData={setCheckoutData} />

          <ShippingMethodSection
            isLoadingMethods={isLoadingMethods}
            shippingMethods={shippingMethods}
            selectedShippingMethod={selectedShippingMethod}
            handleShippingMethodChange={handleShippingMethodChange}
          />

          <PaymentMethodSection
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />

          <PromotionSection
            loadingState={loadingState}
            setLoadingState={setLoadingState}
            setCheckoutData={setCheckoutData}
            totalAmount={checkoutData.totalAmount}
            setDiscountedTotal={setDiscountedTotal}
          />
        </div>

        <div className="md:col-span-5 space-y-8">
          <OrderSummary
            cart={cart}
            checkoutData={checkoutData}
            selectedMethod={selectedMethod}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            isCreatingOrder={isCreatingOrder}
            showConfirmDialog={showConfirmDialog}
            setShowConfirmDialog={setShowConfirmDialog}
            handleConfirmOrder={handleConfirmOrder}
            discountAmount={discountAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(CheckoutPage);
