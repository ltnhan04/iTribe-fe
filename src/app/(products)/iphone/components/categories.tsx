"use client";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "@/constants/page";
import { getProducts } from "@/api/services/products/productsApi";
import { Products } from "@/app/(products)/iphone/type";
import ProductCard from "@/app/(products)/iphone/components/product";

const Categories = () => {
  const router = useRouter();
  const pathName = usePathname();
  const bottomRef = useRef<HTMLSpanElement | null>(null);

  const initialSelectedIndex = () => {
    if (pathName) {
      const currentPath = pathName.split("/").pop();
      const findIndex = categories.findIndex(
        (value) => value.url === currentPath
      );
      return findIndex !== -1 ? findIndex : 0;
    }
    return 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [products, setProducts] = useState<Products[]>([]);

  useLayoutEffect(() => {
    const handleResizeWindow = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResizeWindow);
    return () => window.removeEventListener("resize", handleResizeWindow);
  }, []);

  useLayoutEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.classList.add(
        "border-b-2",
        "border-blue",
        "!text-blue"
      );
    }
  }, []);

  const handleSlugChange = (slug: string, index: number) => {
    setSelectedIndex(index);
    router.push(`/iphone/${slug}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedIndex === 0) {
        try {
          const response = await getProducts();
          setProducts(response.data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedIndex]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center py-2 mt-4 gap-3 sm:gap-5 overflow-hidden">
        {isMobile ? (
          <ScrollArea className="w-full py-2">
            {categories.map((value, index) => (
              <span
                key={index}
                onClick={() => handleSlugChange(value.url, index)}
                className={`${
                  index === selectedIndex
                    ? "text-blue border-b-2 border-b-blue"
                    : ""
                } text-sm text-black py-1 px-2 font-medium transition-colors duration-300 ease-out hover:text-blue cursor-pointer border-b-2 border-transparent hover:border-blue whitespace-nowrap`}
              >
                {value.category}
              </span>
            ))}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          categories.map((value, index) => (
            <span
              key={index}
              onClick={() => handleSlugChange(value.url, index)}
              className={`${
                index === selectedIndex
                  ? "text-blue border-b-2 border-b-blue"
                  : ""
              } text-sm border text-black py-1 px-2 font-medium transition-colors duration-300 ease-out hover:text-blue cursor-pointer border-b-2 border-transparent hover:border-b-blue`}
            >
              {value.category}
            </span>
          ))
        )}
      </div>

      {selectedIndex === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/iphone/${product.slug}/${product._id}`}
            >
              <ProductCard
                _id={product._id}
                price={product.price}
                name={product.name}
                image={product.image}
                colors={product.colors}
                storages={product.storages}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
