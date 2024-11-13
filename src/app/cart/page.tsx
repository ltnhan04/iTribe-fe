/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateCart } from "@/lib/features/cart/cartSlice";
import type { CartType } from "@/lib/features/cart/cartType";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartArray: CartType[] = useAppSelector((state) => state.cart.cart);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 20) return;
    const updatedCart = cartArray.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    dispatch(updateCart(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartArray.filter((item: CartType) => item.id !== id);
    dispatch(updateCart(updatedCart));
  };

  const calculateTotal = () => {
    return cartArray.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    dispatch(updateCart(cartArray));
    router.push("/cart/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      {cartArray.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => router.push("/iphone")}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartArray.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center p-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.price.toLocaleString()} VND
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.id,
                          Math.min(parseInt(e.target.value), 20)
                        )
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="ml-4 text-right flex items-center">
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString()} VND
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-2xl font-bold">
                {calculateTotal().toLocaleString()} VND
              </p>
            </div>
            <Button size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
