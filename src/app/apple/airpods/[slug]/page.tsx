"use client";

import React, { useState } from "react";
import { useGetProductBySlug } from "@/hooks/useProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useToast } from "@/components/ui/use-toast";
import { Variant } from "@/services/products/types";
import Loading from "@/app/loading";
import Breadcrumb from "./components/breadcrumb";
import Gallery from "./components/gallery";
import Info from "./components/info";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb productName={productData.name} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Gallery
          images={selectedVariant?.images || variants[0].images}
        />
        <Info
          name={productData.name}
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantSelect={handleVariantSelect}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          isWishlisted={isWishlisted}
        />
      </div>
    </div>
  );
} 