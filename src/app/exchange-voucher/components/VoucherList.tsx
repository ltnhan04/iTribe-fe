import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Copy, Loader2 } from "lucide-react";
import { IVoucherList } from "@/types/promotion";
import { formatCurrency } from "@/utils/format-currency";
import { toast } from "@/hooks/use-toast";

interface VoucherListProps {
  vouchers: IVoucherList[] | undefined;
  isLoading: boolean;
}

export function VoucherList({ vouchers, isLoading }: VoucherListProps) {
  const getVoucherStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: "Còn hiệu lực",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
        };
      case "used":
        return {
          icon: <XCircle className="w-4 h-4 text-gray-600" />,
          text: "Đã sử dụng",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
        };
      case "expired":
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: "Hết hạn",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
        };
      default:
        return {
          icon: null,
          text: status,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
        };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép!",
      description: "Mã voucher đã được sao chép",
    });
  };

  return (
    <Card className="p-6 bg-white shadow-sm border-gray-200">
      <h2 className="text-xl font-medium mb-4 text-gray-900">
        Voucher của bạn
      </h2>
      <ScrollArea className="h-[400px] pr-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : !vouchers?.length ? (
          <div className="text-center text-gray-500 py-8">
            Chưa có voucher nào
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((voucher) => {
              const status = getVoucherStatus(voucher.status);
              return (
                <Card
                  key={voucher._id}
                  className={`p-4 hover:shadow-md transition-shadow ${status.bgColor}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          Mã: {voucher.code}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(voucher.code)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        {status.icon}
                      </div>
                      <p className="text-sm text-gray-600">
                        Điểm đã dùng: {voucher.pointsUsed}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">
                        {formatCurrency(voucher.discountAmount)} giảm giá
                      </p>
                      <p className="text-sm text-gray-600">
                        Hiệu lực:{" "}
                        {new Date(voucher.validFrom).toLocaleDateString()} -{" "}
                        {new Date(voucher.validTo).toLocaleDateString()}
                      </p>
                      <p className={`text-xs mt-1 ${status.textColor}`}>
                        {status.text}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
