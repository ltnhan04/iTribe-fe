"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Products } from "../type";

const ProductCard = ({ product }: { product: Products }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast({
      title: "Thêm vào giỏ hàng thành công",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn`,
    });
  };

  return (
    <div className="group relative bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
      <Link href={`/apple/ipad/${product.id}`}>
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/apple/ipad/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
