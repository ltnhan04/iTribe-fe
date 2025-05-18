import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorType } from "@/types/common";
import {
  useApplyVoucher,
  useUpdateVoucherAsUsed,
} from "@/hooks/useExchangeVoucher";
interface LoadingState {
  [key: string]: "isConfirming" | "isApplying" | null;
}

interface PromotionProps {
  loadingState: LoadingState;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
  setCheckoutData: React.Dispatch<
    React.SetStateAction<{
      variants: { variant: string; quantity: number }[];
      totalAmount: number;
      shippingAddress: string;
      paymentMethod: string;
    }>
  >;
  totalAmount: number;
  setDiscountedTotal: React.Dispatch<React.SetStateAction<number | null>>;
}

const PromotionSection: React.FC<PromotionProps> = ({
  setLoadingState,
  setCheckoutData,
  totalAmount,
  loadingState,
  setDiscountedTotal,
}) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const { mutateAsync: applyVoucher } = useApplyVoucher();
  const { mutateAsync: updateVoucherAsUsed } = useUpdateVoucherAsUsed();

  const applyAPromotion = async () => {
    setLoadingState((prev) => ({ ...prev, ["apply"]: "isApplying" }));
    try {
      const response = await applyVoucher({
        voucherCode: promoCode,
        orderTotal: totalAmount,
      });

      await updateVoucherAsUsed({
        voucherId: response.data.voucherId,
        orderId: response.data.orderId,
      });

      const newTotal = response.data.discountedTotal;
      setDiscountedTotal(newTotal);
      setCheckoutData((prev) => ({
        ...prev,
        totalAmount: newTotal,
      }));

      toast({
        title: "Sử dụng khuyến mãi thành công",
        description: `Giảm giá còn ${response.data.discountAmount} VND cho đơn hàng.`,
        variant: "default",
      });
    } catch (error: unknown) {
      toast({
        title: "Đã xảy ra lỗi",
        description: (error as ErrorType).response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, ["apply"]: null }));
    }
  };
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg md:text-xl flex items-center gap-3 font-semibold text-gray-800">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow">
            4
          </span>
          Khuyến mãi
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Nhập mã khuyến mãi"
            disabled={loadingState["apply"] === "isApplying"}
            value={promoCode}
            maxLength={20}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 text-sm md:text-base bg-gray-50 border rounded-xl px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Button
            variant={"default"}
            disabled={
              loadingState["apply"] === "isApplying" || promoCode.length === 0
            }
            onClick={applyAPromotion}
            className="text-sm md:text-base h-10 rounded-xl px-5"
          >
            Sử dụng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionSection;
