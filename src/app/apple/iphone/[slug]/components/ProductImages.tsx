"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="sticky top-24 space-y-6">
      <div className="relative h-[500px] bg-white rounded-xl overflow-hidden shadow-sm">
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 ease-out",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={image}
                alt={`Hình ảnh ${index + 1} của ${name}`}
                fill
                className={cn(
                  "object-contain transition-transform duration-700 ease-out p-4",
                  isZoomed ? "scale-150" : "scale-100"
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === currentImageIndex}
                onClick={handleImageClick}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && !isZoomed && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-white/90 z-10 transition-all duration-200"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Ảnh trước</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-white/90 z-10 transition-all duration-200"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Ảnh sau</span>
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="relative">
          <div className="flex gap-3 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ease-out",
                  index === currentImageIndex
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-100"
                )}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Ảnh nhỏ ${index + 1} của ${name}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ProductImages;
