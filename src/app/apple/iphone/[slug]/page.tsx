"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrumb";
import { useGetProductBySlug } from "@/hooks/useProducts";
import Loading from "@/app/loading";
import { ProductResponse } from "./types";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductVariants from "./components/ProductVariants";
import ProductActions from "./components/ProductActions";

export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { data: productData, isLoading } = useGetProductBySlug(params.slug);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    if (productData?.data?.length > 0) {
      setSelectedVariant(productData.data[0]);
    }
  }, [productData]);

  if (isLoading) {
    return <Loading />;
  }

  if (!productData?.data || !selectedVariant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-500">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  const variants = productData.data as ProductResponse[];

  const handleVariantSelect = (colorName: string, storage: string) => {
    const variant = variants.find(
      (v) => v.color.colorName === colorName && v.storage === storage
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb productName={selectedVariant.name} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImages
            images={selectedVariant.images}
            name={selectedVariant.name}
          />

          <div className="space-y-6">
            <ProductInfo variant={selectedVariant} />

            <ProductVariants
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantSelect={handleVariantSelect}
            />

            <ProductActions variant={selectedVariant} />
          </div>
        </div>
      </div>
    </div>
  );
}
