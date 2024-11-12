"use client";
import ProductPage from "@/app/(products)/iphone/components/product";
import React from "react";
import { useRouter } from "next/navigation";
import { data } from "@/dumb-data/page";
import BreadCrumb from "@/components/common/bread-crumb";
import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";
import Categories from "@/app/(products)/iphone/components/categories";
import { formatTitle } from "@/utils/formatTitle";
interface SlugProps {
  params: { category: string };
}

const SlugPage: React.FC<SlugProps> = ({ params }) => {
  const router = useRouter();
  return (
    <>
      <BreadCrumb slug={formatTitle(params.category)} />
      <CarouselAutoPlay />
      <Categories />
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center py-6">
          {formatTitle(params.category)}
        </h1>
        <button onClick={() => router.push(`/iphone/iphone-16-pro`)}>
          test
        </button>
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
          {data.map((value, index) => (
            <ProductPage
              _id={value._id}
              status={value.status}
              key={index}
              price={value.price}
              name={value.name}
              image={value.image}
              colors={value.colors}
              storages={value.storages}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SlugPage;
