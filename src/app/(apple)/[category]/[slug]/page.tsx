"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrumb";
import { useGetProductBySlug } from "@/hooks/useProducts";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductVariants from "./components/ProductVariants";
import ProductActions from "./components/ProductActions";
import ProductReviews from "./components/ProductReviews";
import ProductNotFound from "@/components/common/product-not-found";
import { ProductResponse } from "@/types/slug";

export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { data: productData, isLoading } = useGetProductBySlug(params.slug);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (productData?.data?.length > 0) {
      setSelectedVariant(productData.data[0]);
    }
  }, [productData]);

  if (isLoading) {
    return <Loading />;
  }

  if (!productData?.data || !selectedVariant) {
    return <ProductNotFound />;
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
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
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

        <div className="mt-12">
          <ProductReviews
            reviews={selectedVariant.reviews || []}
            currentUser={user || null}
          />
        </div>
      </div>
    </div>
  );
}
