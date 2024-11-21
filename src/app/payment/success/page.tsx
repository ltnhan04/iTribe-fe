"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { updateOrderPayment } from "@/api/services/payment/paymentApi";
import { toast } from "@/hooks/use-toast";

interface ErrorType {
  response: {
    data: {
      error: string;
    };
  };
}

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id") as string;
  const orderId = searchParams.get("orderId") as string;
  const updatePayment = async () => {
    try {
      const response = await updateOrderPayment({ sessionId, orderId });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
      }
    } catch (error: unknown) {
      const typedError = error as ErrorType;
      toast({
        title: "Error",
        description: typedError.response.data.error,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    updatePayment();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            You will receive a confirmation email shortly with the details of
            your order.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
