import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet } from "lucide-react";

interface CheckoutData {
  variants: { variant: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}
interface PaymentMethodProps {
  checkoutData: CheckoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData>>;
}

const PaymentMethodSection: React.FC<PaymentMethodProps> = ({
  checkoutData,
  setCheckoutData,
}) => {
  const paymentMethods = [
    { id: "momo", label: "Momo", icon: Wallet },
    { id: "stripe", label: "Stripe", icon: CreditCard },
    { id: "ship-cod", label: "Ship Cod", icon: Wallet },
  ];
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg md:text-xl flex items-center gap-3 font-semibold text-gray-800">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow">
            3
          </span>
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <RadioGroup
          value={checkoutData.paymentMethod}
          onValueChange={(value: string | undefined) =>
            setCheckoutData((prev) => ({
              ...prev,
              paymentMethod: value || "",
            }))
          }
          className="space-y-3 md:space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.id}
                className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border rounded-xl cursor-pointer transition-all duration-300 ease-in-out bg-gray-50 hover:bg-primary/10 hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10 peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 text-base font-medium text-gray-700"
              >
                <method.icon className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
                <span className="text-sm md:text-base font-medium text-gray-700">
                  {method.label}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSection;
