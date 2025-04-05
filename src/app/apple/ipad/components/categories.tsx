"use client";
import React, { useLayoutEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { APPLE_CATEGORIES } from "@/constants/categories";
import ProductCard from "./product";
import { Products, ErrorType } from "../type";
import Image from "next/image";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Products[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);

  useLayoutEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err as ErrorType);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`rounded-full ${
              selectedCategory === "all"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-700 text-gray-400 hover:text-white hover:border-white"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả
          </Button>
          {APPLE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`rounded-full ${
                selectedCategory === category.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-700 text-gray-400 hover:text-white hover:border-white"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="w-8 h-8 text-blue-500" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Image
            src="/assets/images/no-product.png"
            alt="No products found"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <p className="text-gray-400">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 