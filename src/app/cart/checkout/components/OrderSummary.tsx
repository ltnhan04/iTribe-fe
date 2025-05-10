/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, LoaderCircle } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderSummaryProps {
  cart: any[];
  checkoutData: {
    totalAmount: number;
  };
  selectedMethod: any;
  shippingCost: number;
  finalTotal: number;
  isCreatingOrder: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleConfirmOrder: () => void;
  discountAmount: number | null;
}

const OrderSummary = ({
  cart,
  checkoutData,
  selectedMethod,
  shippingCost,
  finalTotal,
  isCreatingOrder,
  showConfirmDialog,
  setShowConfirmDialog,
  handleConfirmOrder,
  discountAmount,
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <ShoppingBag className="mr-3 h-6 w-6" />
          Tổng Quan Đơn Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-muted/50"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-medium">
              {(item.price * item.quantity).toLocaleString()} VND
            </p>
          </div>
        ))}

        <div className="space-y-3 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{checkoutData.totalAmount.toLocaleString()} VND</span>
          </div>
          {discountAmount !== null && discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-muted-foreground">Giảm giá</span>
              <span>-{discountAmount.toLocaleString()} VND</span>
            </div>
          )}
          {selectedMethod && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Phí vận chuyển ({selectedMethod.name})
              </span>
              <span>{shippingCost.toLocaleString()} VND</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-medium">Tổng tiền</span>
            <span className="text-xl font-semibold">
              {finalTotal.toLocaleString()} VND
            </span>
          </div>
        </div>

        <div className="pt-6">
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="w-full h-12 text-base font-medium"
                disabled={isCreatingOrder}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Đặt Hàng
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  Xác Nhận Đơn Hàng
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Vui lòng kiểm tra lại thông tin đơn hàng trước khi xác nhận.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isCreatingOrder}
                  className="h-11"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirmOrder}
                  disabled={isCreatingOrder}
                  className="h-11"
                >
                  {isCreatingOrder ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
