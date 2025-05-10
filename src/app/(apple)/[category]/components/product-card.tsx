"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  variant: ProductVariant;
  productName: string;
}

const ProductCard = ({ variant, productName }: ProductCardProps) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const cartItem = {
      id: variant._id,
      name: variant.color.colorName,
      image: variant.images[0],
      price: variant.price,
      quantity: 1,
      storage: variant.storage,
      color: variant.color.colorName,
      status: variant.status,
    };
    dispatch(addToCart({ ...cartItem, id: cartItem.id as string }));
    toast({
      title: "Thêm vào giỏ hàng",
      description: "Sản phẩm đã được thêm vào giỏ hàng của bạn",
    });
  };
  const isOutOfStock = variant.stock_quantity === 0;

  return (
    <Link href={`/iphone/${variant.slug}`}>
      <div className="group relative bg-[#FAFAFA] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl border border-[#e2e2e2]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA] to-[#F5F5F7] opacity-70"></div>

        <div className="aspect-square relative overflow-hidden">
          <Image
            src={variant.images[0]}
            alt={`${productName} ${variant.color.colorName}`}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        <div className="p-6 relative z-10">
          <h3 className="text-[17px] leading-tight font-medium text-[#1D1D1F] mb-1 tracking-tight">
            {productName} {variant.storage}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[13px] font-medium text-gray-600">
              {variant.storage}
            </span>
            <span className="text-[13px] text-gray-400">•</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{
                  backgroundColor: variant.color.colorCode || "#000000",
                }}
              />
              <span className="text-[13px] font-medium text-gray-600">
                {variant.color.colorName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[12px] ${
                  star <= (variant.rating || 0)
                    ? "text-yellow-500"
                    : "text-gray-200"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-[12px] text-gray-500 ml-1">
              ({variant.rating || 0})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-gray-500 mb-0.5">Giá từ</p>
              <p className="text-lg font-medium text-[#1D1D1F]">
                {variant.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`rounded-full w-10 h-10 p-0 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ${
                isOutOfStock
                  ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                  : ""
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </Button>
          </div>

          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
              Hết hàng
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
