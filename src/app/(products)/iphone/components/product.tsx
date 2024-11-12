import Image from "next/image";
import React from "react";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/lib/utils";

import type { Color } from "@/app/(products)/iphone/type";

interface ProductProps {
  _id: string;
  price: number;
  name: string;
  colors: Color[];
  storages: string[];
  image: string | null;
  status: string;
}

const ProductCard: React.FC<ProductProps> = ({
  price,
  name,
  colors,
  storages,
  image,
  status,
}) => {
  return (
    <div className="px-5 py-3 bg-background w-full cursor-pointer max-w-60 border border-border rounded-xl transition-all duration-200 ease-out hover:shadow-lg shadow-md">
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[200px] h-[250px]">
          {image ? (
            <Image
              src={image}
              fill={true}
              alt={`${name} image`}
              className="object-contain rounded-lg"
              priority
              quality={100}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          {colors.length > 0 ? (
            colors.map((color, index) => (
              <span
                key={index}
                className="w-5 h-5 rounded-full border-2 outline outline-2 outline-offset-2 transition-all duration-300"
                style={{
                  backgroundColor: color.colorCode,
                  borderColor: `gray`,
                  outlineColor: color.colorCode,
                  boxShadow: `0 0 5px ${color.colorCode}55`,
                }}
                title={color.colorName}
              ></span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No color options
            </span>
          )}
        </div>
        <div className="text-xl font-semibold text-foreground">{name}</div>
        <div className="text-lg font-medium text-foreground py-2">
          {price > 0 ? formatCurrency(price) : "Price not available"}
        </div>
        <div className="flex items-center gap-2">
          {storages.length > 0 ? (
            storages.map((storage, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
              >
                {storage}GB
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No storage options
            </span>
          )}
        </div>
        <div
          className={cn(
            "mt-2 px-2 py-1 text-sm rounded-full",
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {status}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
