/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  useExchangeVoucher,
  useRetrievePoints,
  useGetVouchers,
} from "@/hooks/useExchangeVoucher";
import { PointsCard } from "./components/PointsCard";
import { ExchangeCard } from "./components/ExchangeCard";
import { VoucherList } from "./components/VoucherList";
import BreadCrumb from "./components/bread-crumb";
import { toast } from "@/hooks/use-toast";

export default function ExchangeVoucherPage() {
  const [pointToUse, setPointToUse] = useState<string>("");
  const { data: pointsData, isLoading: isLoadingPoints } = useRetrievePoints();
  const { data: vouchersData, isLoading: isLoadingVouchers } = useGetVouchers();
  const { mutate: exchangeVoucher, isPending: isExchanging } =
    useExchangeVoucher();

  const handleExchange = async () => {
    const points = parseInt(pointToUse);
    if (points <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điểm hợp lệ",
        variant: "destructive",
      });
      return;
    }

    if (points > (pointsData?.data?.points || 0)) {
      toast({
        title: "Không đủ điểm",
        description: "Bạn không có đủ điểm để đổi voucher",
        variant: "destructive",
      });
      return;
    }

    exchangeVoucher(points, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Đổi voucher thành công",
        });
        setPointToUse("");
      },
      onError: (error: any) => {
        toast({
          title: "Lỗi",
          description:
            error?.response?.data?.message ||
            "Không thể đổi voucher. Vui lòng thử lại.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto px-4">
      <BreadCrumb />
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Đổi Điểm Lấy Voucher
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PointsCard
            points={pointsData?.data?.points || 0}
            isLoading={isLoadingPoints}
          />
          <ExchangeCard
            pointToUse={pointToUse}
            setPointToUse={setPointToUse}
            onExchange={handleExchange}
            isExchanging={isExchanging}
            maxPoints={pointsData?.data?.points || 0}
          />
        </div>
        <VoucherList
          vouchers={vouchersData?.data}
          isLoading={isLoadingVouchers}
        />
      </div>
    </div>
  );
}
