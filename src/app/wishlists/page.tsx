"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const initialWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "iPhone 11",
    price: 8990000,
    image:
      "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384247/products/bz7g3xcjoeu2wugxvqxj.jpg",
  },
  {
    id: "2",
    name: "AirPods Pro",
    price: 4990000,
    image:
      "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384247/products/bz7g3xcjoeu2wugxvqxj.jpg",
  },
  {
    id: "3",
    name: "MacBook Air",
    price: 25990000,
    image:
      "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384247/products/bz7g3xcjoeu2wugxvqxj.jpg",
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(initialWishlistItems);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const addToCart = (id: string) => {
    console.log(`Added item ${id} to cart`);
    // Here you would typically call an API to add the item to the cart
    // For now, we'll just remove it from the wishlist
    removeFromWishlist(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add items to your wishlist to keep track of products you &apos re
            interested in.
          </p>
          <Button>Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
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
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                    <Button size="sm" onClick={() => addToCart(item.id)}>
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
