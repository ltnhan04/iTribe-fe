"use client";
import React, { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { carousel } from "@/constants/page";
import Image from "next/image";

export default function CarouselAutoPlay() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-black w-full max-w-[1400px] mx-auto"
    >
      <CarouselContent>
        {carousel.map((_, index) => (
          <CarouselItem key={index} className="flex items-center justify-center">
            <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[500px]">
              <Image
                src={carousel[index]}
                alt="image"
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                quality={100}
                priority={true}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant={"secondary"}
        className="border-gray-700 bg-black/50 hover:bg-black/70 text-white h-10 w-10 sm:h-12 sm:w-12 border absolute top-[50%] -translate-y-1/2 left-4"
      />
      <CarouselNext
        variant={"secondary"}
        className="border-gray-700 bg-black/50 hover:bg-black/70 text-white h-10 w-10 sm:h-12 sm:w-12 border absolute top-[50%] -translate-y-1/2 right-4"
      />
    </Carousel>
  );
} 