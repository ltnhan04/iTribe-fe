import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, WalletCards } from "lucide-react";

interface CheckoutData {
  productVariants: { productVariant: string; quantity: number }[];
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
    { id: "pointer-wallet", label: "Pointer Wallet", icon: Wallet },
    { id: "stripe", label: "Stripe", icon: CreditCard },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center">
          <WalletCards className="mr-2 h-6 w-6 text-primary" />
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-50 peer-checked:border-blue peer-checked:bg-blue/70 peer-focus:ring-2 peer-focus:ring-blue peer-focus:ring-offset-2"
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
