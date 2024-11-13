"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeFromWishlist } from "@/lib/features/wishlists/wistlistSlice";
import { addToCart } from "@/lib/features/cart/cartSlice";
import type { WishlistType } from "@/lib/features/wishlists/wishlistsType";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const wishlistItems: WishlistType[] = useAppSelector(
    (state) => state.wishlist.wishlists
  );

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item: WishlistType) => {
    dispatch(addToCart({ ...item, quantity: item.quantity ?? 1 }));
    dispatch(removeFromWishlist(item.id));
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add items to your wishlist to keep track of products youre
            interested in.
          </p>
          <Button onClick={() => router.push("/iphone")}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item: WishlistType) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {item.price.toLocaleString()} VND
                  </p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                    <Button size="sm" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
