import React from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
import Image from "next/image";

export default function Details() {
  return (
    <div className="flex items-center ">
      <div className="relative w-[500px] h-[500px]">
        <Image
          src={
            "https://res.cloudinary.com/durjxrcdm/image/upload/v1728022257/products/uy6yrwsenownycjyjqxt.png"
          }
          fill={true}
          quality={100}
          priority={true}
          sizes="w-full h-full"
          alt="image"
        />
      </div>
      <div></div>
    </div>
  );
}
