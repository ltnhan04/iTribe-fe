"use client";

import React, { useState } from "react";
import { useGetProductBySlug } from "@/hooks/useProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Variant } from "@/services/products/types";
import Loading from "@/app/loading";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const { data: product, isLoading } = useGetProductBySlug(params.slug);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  if (isLoading) {
    return <Loading />;
  }

  if (!product?.data || product.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-500">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  const productData = product.data[0];
  const variants = productData.variants;

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: "Vui lòng chọn phiên bản",
        description: "Hãy chọn màu sắc và dung lượng trước khi thêm vào giỏ hàng",
        variant: "destructive",
      });
      return;
    }

    if (selectedVariant.stock_quantity === 0) {
      toast({
        title: "Hết hàng",
        description: "Sản phẩm này hiện đang hết hàng",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        _id: selectedVariant._id,
        name: `${productData.name} ${selectedVariant.color.colorName} ${selectedVariant.storage}`,
        price: selectedVariant.price,
        image: selectedVariant.images[0],
        quantity: 1,
      })
    );

    toast({
      title: "Thêm vào giỏ hàng thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng của bạn",
    });
  };

  const handleAddToWishlist = () => {
    if (!selectedVariant) {
      toast({
        title: "Vui lòng chọn phiên bản",
        description:
          "Hãy chọn màu sắc và dung lượng trước khi thêm vào danh sách yêu thích",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToWishlist({
        _id: selectedVariant._id,
        name: `${productData.name} ${selectedVariant.color.colorName} ${selectedVariant.storage}`,
        price: selectedVariant.price,
        image: selectedVariant.images[0],
      })
    );

    setIsWishlisted(true);
    toast({
      title: "Thêm vào danh sách yêu thích thành công",
      description: "Sản phẩm đã được thêm vào danh sách yêu thích của bạn",
    });
  };

  const uniqueColors = Array.from(
    new Set(variants.map((variant) => variant.color.colorName))
  );

  const uniqueStorages = Array.from(
    new Set(variants.map((variant) => variant.storage))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="relative aspect-square">
          <Image
            src={selectedVariant?.images[0] || variants[0].images[0]}
            alt={productData.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {productData.name}
          </h1>

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
                    onClick={() => handleVariantSelect(variant)}
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
                      onClick={() => handleVariantSelect(variant)}
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
              onClick={handleAddToCart}
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
              onClick={handleAddToWishlist}
              disabled={!selectedVariant}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 