import ProductPage from "@/app/(products)/iphone/components/product";
import React from "react";
import { data } from "@/dumb-data/page";
interface SlugProps {
  params: { slug: string };
}

const SlugPage: React.FC<SlugProps> = ({ params }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center py-6">{params.slug}</h1>
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
        {data.map((value, index) => (
          <ProductPage
            key={index}
            price={value.price}
            category={value.category}
            image={value.image}
            rating={value.rating}
            colors={value.colors}
          />
        ))}
      </div>
    </div>
  );
};

export default SlugPage;
