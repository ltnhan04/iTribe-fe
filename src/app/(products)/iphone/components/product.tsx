import Image from "next/image";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { formatCurrency } from "@/utils/format-currency";
import type { Color } from "@/app/(products)/iphone/type";

interface ProductProps {
  _id: string;
  price: number;
  name: string;
  colors: Color[];
  storages: string[];
  image: string | null;
}

const ProductCard: React.FC<ProductProps> = ({
  price,
  name,
  colors,
  storages,
  image,
}) => {
  const uniqueColors = colors.reduce((acc: Color[], color) => {
    if (!acc.some((c) => c.colorCode === color.colorCode)) {
      acc.push(color);
    }
    return acc;
  }, []);

  return (
    <Card className="w-full max-w-sm p-4 bg-background border border-border rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="flex flex-col items-center">
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
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2 py-2">
          {uniqueColors.length > 0 ? (
            uniqueColors.map((color, index) => (
              <span
                key={index}
                className="w-4 h-4 rounded-full border transition-all duration-300"
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
        <CardTitle className="text-lg font-semibold text-foreground">
          {name}
        </CardTitle>
        <div className="text-md font-medium text-foreground py-2">
          {price > 0 ? formatCurrency(price) : "Price not available"}
        </div>
        <div className="flex items-center gap-2 justify-center">
          {storages.length > 0 ? (
            storages.map((storage, index) => (
              <Badge key={index} className="px-2 py-1 bg-blue">
                {storage}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No storage options
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
