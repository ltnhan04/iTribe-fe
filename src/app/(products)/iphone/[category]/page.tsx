"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductPage from "@/app/(products)/iphone/components/product";
import BreadCrumb from "@/components/common/bread-crumb";
import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";
import Categories from "@/app/(products)/iphone/components/categories";
import { Spinner } from "@/components/ui/spinner";

import { formatTitle } from "@/utils/formatTitle";
import { getProductByName } from "@/api/services/products/productsApi";
import { Products } from "@/app/(products)/iphone/type";
import { toast } from "@/hooks/use-toast";
import { ErrorType } from "@/app/(products)/iphone/type";

const NoProductFound = "/assets/images/product-not-found.png";

interface SlugProps {
  params: { category: string };
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
        toast({
          title: "Uh oh! Something went wrong.",
          description: (error as ErrorType).response.data.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.category]);

  return (
    <>
      <BreadCrumb slug={formatTitle(params.category)} />
      <CarouselAutoPlay />
      <Categories />

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="mx-auto mt-2">
            <Spinner />
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="relative w-[250px] h-[300px]">
                  <Image
                    src={NoProductFound}
                    fill={true}
                    alt="product not found"
                    quality={100}
                    className="object-contain rounded-lg"
                    priority
                  />
                  <div className="text-base text-primary text-center w-full absolute bottom-[15%]">
                    Tiếc quá !{" "}
                    <strong className="text-blue">
                      {formatTitle(params.category)}
                    </strong>{" "}
                    hết hàng rồi.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-lg md:text-2xl font-bold text-center py-2 md:py-6">
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
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SlugPage;
