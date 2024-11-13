"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, CreditCard, Wallet } from "lucide-react";

import { useAppSelector } from "@/lib/hooks";
import type { CartType } from "@/lib/features/cart/cartType";

export default function CheckoutPage() {
  const cart = useAppSelector((state) => state.cart.cart);
  const totalAmount = useAppSelector((state) => state.cart.total);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");

  const handleConfirmOrder = () => {
    const checkoutData = {
      products: cart.map((item: CartType) => ({
        product: item.id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: "123 Example St, City, Country",
      paymentMethod: selectedPaymentMethod,
      stripeSessionId: "id12",
    };

    console.log("Order confirmed", checkoutData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.map((item: CartType) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p>{(item.price * item.quantity).toLocaleString()} VND</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>{totalAmount.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>123 Example St, City, Country</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pointer-wallet" id="pointer-wallet" />
                  <Label htmlFor="pointer-wallet" className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Pointer Wallet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Stripe
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Confirm Order</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please review your order details before confirming.
              </p>
              <Button onClick={handleConfirmOrder} className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
