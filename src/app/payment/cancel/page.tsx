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
            Payment Failed
          </CardTitle>
          <CardDescription className="text-center">
            We're sorry, but your payment could not be processed at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Please check your payment details and try again, or contact our
            support team if you need assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/chatbox">Contact Support</Link>
          </Button>
          <Button asChild>
            <Link href="/cart/checkout">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
