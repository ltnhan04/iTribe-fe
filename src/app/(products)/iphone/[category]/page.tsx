"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductPage from "@/app/(products)/iphone/components/product";
import BreadCrumb from "@/components/common/bread-crumb";
import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";

import Categories from "@/app/(products)/iphone/components/categories";
import { formatTitle } from "@/utils/formatTitle";
import { getProductByName } from "@/api/services/products/productsApi";
import { Products } from "@/app/(products)/iphone/type";
import Loading from "@/app/loading";
import { toast } from "@/hooks/use-toast";

interface SlugProps {
  params: { category: string };
}
interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}
const SlugPage: React.FC<SlugProps> = ({ params }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getProductByName(formatTitle(params.category));
        setProducts(response.data.data);
      } catch (error: unknown) {
        const typedError = error as ErrorType;
        toast({
          title: "Error",
          description: typedError.response.data.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.category]);
  if (isLoading) return <Loading />;

  return (
    <>
      <BreadCrumb slug={formatTitle(params.category)} />
      <CarouselAutoPlay />
      <Categories />

      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center py-6">
          {formatTitle(params.category)}
        </h1>

        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/iphone/${product.slug}/${product._id}`}
              className="w-full"
            >
              <ProductPage
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
      </div>
    </>
  );
};

export default SlugPage;
