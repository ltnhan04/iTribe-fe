"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Variant } from "@/services/products/types";
import ProductCard from "@/app/apple/iphone/components/product-card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

interface CategoriesProps {
  products: Product[];
  variants: Variant[];
}

const Categories = ({ products, variants }: CategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Variant[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (selectedCategory === "all") {
        setFilteredProducts(variants);
      } else {
        const filtered = variants.filter(
          (variant) => variant.product === selectedCategory
        );
        setFilteredProducts(filtered);
      }
      setLoading(false);
    }, 1000);
  }, [variants, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => handleCategoryChange("all")}
              className={`rounded-full ${
                selectedCategory === "all"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Tất cả
            </Button>
            {products.map((product) => (
              <Button
                key={product._id}
                variant={
                  selectedCategory === product._id
                    ? "default"
                    : "outline"
                }
                onClick={() => handleCategoryChange(product._id)}
                className={`rounded-full ${
                  selectedCategory === product._id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {product.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <Spinner className="w-8 h-8 text-blue-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64">
            <Image
              src="/assets/empty.png"
              alt="Không có sản phẩm"
              width={200}
              height={200}
              className="mb-4"
            />
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          filteredProducts.map((variant) => (
            <ProductCard 
              key={variant._id} 
              variant={variant}
              productName={products.find(p => p._id === variant.product)?.name || ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
