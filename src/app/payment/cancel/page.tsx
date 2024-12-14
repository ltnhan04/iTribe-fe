/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Thanh toán thất bại
          </CardTitle>
          <CardDescription className="text-center">
            Chúng tôi rất tiếc, thanh toán của bạn không thành công.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Vui lòng kiểm tra lại thông tin thanh toán và thử lại. Nếu cần hỗ
            trợ, hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/chatbox">Liên hệ hỗ trợ</Link>
          </Button>
          <Button asChild>
            <Link href="/cart/checkout">Thử lại</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
