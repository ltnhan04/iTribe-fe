import Image from "next/image";
import React from "react";
import { Star } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

interface ProductProps {
  price: number;
  category: string;
  image: string;
  rating: number;
  colors: string[];
}
const ProductPage: React.FC<ProductProps> = ({
  price,
  category,
  image,
  rating,
  colors,
}) => {
  return (
    <div className="px-5 py-3 bg-gray-primary w-full cursor-pointer max-w-60 border border-gray-border rounded-xl transition-shadow duration-200 ease-out hover:shadow-lg shadow-md">
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[200px] h-[250px]">
          <Image
            src={image}
            fill={true}
            alt="product image"
            className="object-contain rounded-lg"
            priority
            quality={100}
          />
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          {colors.length > 0 &&
            colors.map((value, index) => (
              <span
                key={index}
                className="w-5 h-5 rounded-full border-2 outline outline-2 outline-offset-2 transition-all duration-300"
                style={{
                  backgroundColor: value,
                  borderColor: value,
                  outlineColor: value,
                  boxShadow: `0 0 5px ${value}55`,
                }}
              ></span>
            ))}
        </div>
        <div className="text-xl font-semibold text-gray-800">{category}</div>
        <div className="text-lg font-medium text-black py-2">
          {formatCurrency(price)}
        </div>
        <div className="flex items-center gap-1">
          {rating > 0 ? (
            [...Array(rating)].map((_, index) => (
              <Star key={index} className="w-4 h-4 text-amber-400" />
            ))
          ) : (
            <span className="text-sm text-gray-500">Chưa có đánh giá nào.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
