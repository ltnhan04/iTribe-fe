import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TicketPercent } from "lucide-react";
import { applyPromotion } from "@/services/promotions/promotionApi";
import type { ErrorType } from "../checkout/type";

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
}

const PromotionSection: React.FC<PromotionProps> = ({
  setLoadingState,
  setCheckoutData,
  totalAmount,
  loadingState,
}) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");

  const applyAPromotion = async () => {
    setLoadingState((prev) => ({ ...prev, ["apply"]: "isApplying" }));
    try {
      const response = await applyPromotion({
        code: promoCode,
        totalAmount: totalAmount,
      });
      const data = response.data;
      setCheckoutData((prev) => ({
        ...prev,
        totalAmount: data.discountedAmount,
      }));
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
      setLoadingState((prev) => ({ ...prev, ["apply"]: null }));
    }
  };
  return (
    <Card className="mt-6 md:mt-8">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center">
          <TicketPercent className="mr-2 h-6 w-6 text-primary" />
          Khuyến mãi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Nhập mã khuyến mãi"
            disabled={loadingState["apply"] === "isApplying"}
            value={promoCode}
            maxLength={20}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 text-sm md:text-base"
          />
          <Button
            variant={"default"}
            disabled={
              loadingState["apply"] === "isApplying" || promoCode.length === 0
            }
            onClick={applyAPromotion}
            className="text-sm md:text-base"
          >
            Sử dụng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionSection;
