"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

import withAuth from "@/components/common/withAuth";

import { ShoppingBag, CreditCard, Wallet, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAppSelector } from "@/lib/hooks";
import type { CartType } from "@/lib/features/cart/cartType";
import type { Promotion } from "@/app/cart/checkout/type";

import {
  applyPromotion,
  getPromotions,
} from "@/api/services/promotions/promotionApi";
import { createOrder } from "@/api/services/orders/orderApi";

const CheckoutPage = () => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.cart);
  const [totalAmount, setTotalAmount] = useState(
    useAppSelector((state) => state.cart.total)
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await getPromotions();
      setPromotions(response.data.promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const applyAPromotion = async () => {
    try {
      const response = await applyPromotion({
        code: promoCode,
        totalAmount: totalAmount,
      });
      const data = response.data;
      setTotalAmount(data.discountedAmount);
      setSelectedPromotion(
        promotions.find((promo) => promo.code === promoCode) || null
      );
      toast({
        title: "Promotion Applied",
        description: `Discount of ${data.discountAmount} VND applied successfully.`,
      });
    } catch (error) {
      console.error("Error applying promotion:", error);
      toast({
        title: "Error",
        description: "An error occurred while applying the promotion.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmOrder = async () => {
    const checkoutData = {
      productVariants: cart.map((item: CartType) => ({
        productVariant: item.id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: "123 Example St, City, Country",
      paymentMethod: selectedPaymentMethod,
    };
    console.log(checkoutData);

    const response = await createOrder(checkoutData);
    if (response.status === 201) {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully.",
      });
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    }
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

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Apply Promotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button onClick={applyAPromotion}>Apply</Button>
              </div>
              {selectedPromotion && (
                <div className="text-sm text-green-600">
                  Promotion applied: {selectedPromotion.code} (
                  {selectedPromotion.discountPercentage}% off)
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Available Promotions:</h4>
                <ul className="space-y-2">
                  {promotions.map((promo) => (
                    <li key={promo._id} className="flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span>
                        {promo.code} - {promo.discountPercentage}% off
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center">
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
};

export default withAuth(CheckoutPage);
