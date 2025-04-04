"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Variant } from "@/services/products/types";

interface InfoProps {
  name: string;
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantSelect: (variant: Variant) => void;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  isWishlisted: boolean;
}

const Info: React.FC<InfoProps> = ({
  name,
  variants,
  selectedVariant,
  onVariantSelect,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
}) => {
  const uniqueColors = Array.from(
    new Set(variants.map((variant) => variant.color.colorName))
  );

  const uniqueStorages = Array.from(
    new Set(variants.map((variant) => variant.storage))
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>

      {/* Màu sắc */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((color) => {
            const variant = variants.find(
              (v) => v.color.colorName === color
            );
            if (!variant) return null;
            return (
              <Button
                key={color}
                variant={
                  selectedVariant?.color.colorName === color
                    ? "default"
                    : "outline"
                }
                className="flex items-center gap-2"
                onClick={() => onVariantSelect(variant)}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: variant.color.hexCode }}
                />
                <span>{color}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Dung lượng */}
      {uniqueStorages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Dung lượng
          </h3>
          <div className="flex flex-wrap gap-3">
            {uniqueStorages.map((storage) => {
              const variant = variants.find((v) => v.storage === storage);
              if (!variant) return null;
              return (
                <Button
                  key={storage}
                  variant={
                    selectedVariant?.storage === storage
                      ? "default"
                      : "outline"
                  }
                  onClick={() => onVariantSelect(variant)}
                >
                  {storage}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Giá và trạng thái */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {selectedVariant
              ? formatPrice(selectedVariant.price)
              : formatPrice(variants[0].price)}
          </span>
          {selectedVariant?.stock_quantity === 0 ? (
            <Badge variant="destructive">Hết hàng</Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Còn hàng
            </Badge>
          )}
        </div>
      </div>

      {/* Nút thêm vào giỏ hàng và yêu thích */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-1"
          onClick={onAddToCart}
          disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Thêm vào giỏ hàng
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={`${
            isWishlisted ? "bg-pink-50 text-pink-600" : ""
          } border-2`}
          onClick={onAddToWishlist}
          disabled={!selectedVariant}
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default Info; 