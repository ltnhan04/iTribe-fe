"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Variant } from "@/services/products/types";

interface ProductCardProps {
  variant: Variant;
  productName: string;
}

export default function ProductCard({ variant, productName }: ProductCardProps) {
  return (
    <Link
      href={`/apple/macbook/${variant.slug}`}
      className="group bg-[#FBFBFD] rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-square relative mb-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden">
        <Image
          src={variant.images[0]}
          alt={productName}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {variant.stock_quantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Hết hàng
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-medium text-gray-900 line-clamp-1">
            {productName}
          </h3>
          <div
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{ backgroundColor: variant.color.colorCode }}
          />
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>{variant.storage}</span>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(variant.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            {variant.price.toLocaleString("vi-VN")}đ
          </div>
        </div>
      </div>
    </Link>
  );
} 