"use client";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const images = [
  "https://res.cloudinary.com/durjxrcdm/image/upload/v1728022257/products/uy6yrwsenownycjyjqxt.png",
  "https://res.cloudinary.com/durjxrcdm/image/upload/v1728022666/products/lpz82xkeuanntzkid8sz.png",
  "https://res.cloudinary.com/durjxrcdm/image/upload/v1728023135/products/dsyseamsibwqhoepemun.webp",
  "https://res.cloudinary.com/durjxrcdm/image/upload/v1728022257/products/uy6yrwsenownycjyjqxt.png",
  "https://res.cloudinary.com/durjxrcdm/image/upload/v1728022666/products/lpz82xkeuanntzkid8sz.png",
];

export default function Details() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="flex flex-col items-center gap-y-6">
        <Carousel className="w-full max-w-[500px] relative">
          <CarouselContent
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="relative w-[500px] h-[500px]">
                    <Image
                      src={image}
                      fill={true}
                      quality={100}
                      priority={true}
                      sizes="w-full h-full"
                      alt="image"
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[60%] sm:top-[55%] right-3"
          />
          <CarouselPrevious
            disabled={false}
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
            className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[60%] sm:top-[55%] left-3"
          />
        </Carousel>

        <div className="flex items-center justify-between space-x-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-16 h-16 border ${
                index === currentIndex ? "border-blue" : "border-gray-border"
              } rounded-md cursor-pointer border-2 opacity-100 transition-colors duration-300 ease-in hover:opacity-80 hover:border-blue overflow-hidden`}
            >
              <Image
                src={image}
                fill={true}
                quality={100}
                priority={true}
                sizes="w-full h-full"
                alt="image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
