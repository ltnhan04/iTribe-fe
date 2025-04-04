import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Variant } from "@/services/products/types";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  variant: Variant;
  productName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ variant, productName }) => {
  const isOutOfStock = variant.stock_quantity === 0;

  return (
    <Link
      href={`/apple/airpods/${variant.product}`}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square relative">
        <Image
          src={variant.images[0]}
          alt={productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isOutOfStock && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 z-10 bg-red-500"
          >
            Hết hàng
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800 line-clamp-2">
          {productName}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{ backgroundColor: variant.color.hexCode }}
          />
          <span className="text-sm text-gray-600">{variant.color.colorName}</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          <span className="text-sm text-gray-600">{variant.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg text-gray-900">
            {formatPrice(variant.price)}
          </p>
          {variant.stock_quantity > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Còn hàng
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 