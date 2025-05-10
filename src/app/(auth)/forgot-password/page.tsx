/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { forgotPassword } from "@/services/auth/authApi";
import { toast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ErrorType } from "@/types/common";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!validateEmail(email)) {
      setErrorMessage("Email không hợp lệ. Vui lòng nhập lại.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: response.data.message,
        });
        setSuccess(true);
      }
    } catch (err: unknown) {
      const error = err as ErrorType;
      setErrorMessage(error.response.data.message || "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <CardHeader className="text-center">
            <Image
              src="/assets/images/i-Tribe-logo.png"
              alt="iTribe Logo"
              width={120}
              height={120}
              className="mx-auto mb-4 rounded-xl"
            />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Kiểm tra email của bạn
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chúng tôi đã gửi link đặt lại mật khẩu vào email của bạn.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={isLoading}
              onClick={() => router.push("/login")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Quay lại đăng nhập
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <Image
            src="/assets/images/i-Tribe-logo.png"
            alt="iTribe Logo"
            width={120}
            height={120}
            className="mx-auto mb-4 rounded-2xl"
          />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nhập email của bạn để đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {errorMessage && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled={isLoading}
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Vui lòng đợi...
                </>
              ) : (
                "Gửi link đặt lại mật khẩu"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
