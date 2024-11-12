"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, CreditCard, Wallet } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CheckoutData {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  stripeSessionId: string;
}

// This would typically come from your API
const fetchProductDetails = async (productId: string): Promise<Product> => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: productId,
    name: "iPhone 13",
    price: 5000000,
  };
};

export default function CheckoutPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    products: [
      {
        product: "672ccb9f7aede78237e074dd",
        quantity: 3,
      },
    ],
    totalAmount: 15000000,
    shippingAddress: "123 Example St, City, Country",
    paymentMethod: "pointer-wallet",
    stripeSessionId: "id12",
  });

  const [productDetails, setProductDetails] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const details = await Promise.all(
        checkoutData.products.map((p) => fetchProductDetails(p.product))
      );
      setProductDetails(details);
    };
    fetchProducts();
  }, [checkoutData.products]);

  const handleConfirmOrder = () => {
    console.log("Order confirmed", checkoutData);
    // Here you would typically send this data to your backend
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
              {productDetails.map((product, index) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {checkoutData.products[index].quantity}
                    </p>
                  </div>
                  <p>
                    {(
                      product.price * checkoutData.products[index].quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>{checkoutData.totalAmount.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{checkoutData.shippingAddress}</p>
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
                defaultValue={checkoutData.paymentMethod}
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
                    Credit Card
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
