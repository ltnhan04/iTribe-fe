"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  CreditCard,
  MapPin,
  Calendar,
  Clock4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/lib/hooks";
import { toast } from "@/hooks/use-toast";
import { clearCart } from "@/lib/features/cart/cartSlice";
import {
  updateOrderPayment,
  updateMomoPaymentStatus,
} from "@/services/payment/paymentApi";
import { ErrorType as ErrorResponse } from "@/types/common";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-day";
import { OrderDetails } from "@/types/order";

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id") as string;
  const orderId = searchParams.get("orderId") as string;

  useEffect(() => {
    const updatePayment = async () => {
      try {
        let response;
        if (sessionId) {
          response = await updateOrderPayment({ sessionId, orderId });
        } else if (orderId) {
          response = await updateMomoPaymentStatus(orderId);
        }

        if (response?.status === 200) {
          toast({
            title: "Thành công",
            description: response.data.message,
            variant: "default",
          });
          setOrder(response.data.data);
          dispatch(clearCart());
        }
      } catch (error: unknown) {
        toast({
          title: "Lỗi",
          description: (error as ErrorResponse).response.data.message,
          variant: "destructive",
        });
      }
    };
    updatePayment();
  }, [dispatch, orderId, sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-xl md:text-3xl font-bold text-center text-gray-800">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription className="text-center text-sm md:text-base text-gray-600">
            Cảm ơn bạn đã mua hàng. Thanh toán của bạn đã được xử lý thành công.
          </CardDescription>
        </CardHeader>
        <CardContent className=" space-y-4 md:space-y-6">
          {order && (
            <>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
                <h3 className="font-semibold text-base md:text-lg mb-4 text-gray-800">
                  Chi tiết đơn hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Mã đơn hàng</span>
                      <span className="font-medium text-gray-800">
                        {order._id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Tổng tiền</span>
                      <span className="font-medium text-gray-800">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Clock4 className="h-5 w-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Trạng thái</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Ngày giao dịch
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
                <h3 className="font-semibold text-base md:text-lg mb-4 text-gray-800">
                  Thông tin giao hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="h-5 w-5 flex-shrink-0 text-gray-600 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Địa chỉ giao hàng
                      </span>
                      <span className="text-gray-800">
                        {order.shippingAddress}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <CreditCard className="h-5 w-5 flex-shrink-0 text-gray-600 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Phương thức thanh toán
                      </span>
                      <span className="text-gray-800 capitalize">
                        {order.paymentMethod === "stripe"
                          ? "Stripe"
                          : order.paymentMethod === "momo"
                          ? "MoMo"
                          : "Thanh toán khi nhận hàng"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <Separator className="my-6" />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-6">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" asChild>
            <Link href="/orders">Theo dõi đơn hàng</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
