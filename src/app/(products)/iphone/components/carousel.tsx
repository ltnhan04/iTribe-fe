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
      className="relative"
    >
      <CarouselContent>
        {carousel.map((_, index) => (
          <CarouselItem key={index}>
            <div className="relative mt-5 sm:mt-7 w-full h-20 sm:h-80">
              <Image
                src={carousel[index]}
                alt="image"
                fill
                className="rounded-xl"
                quality={100}
                priority={true}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant={"secondary"}
        className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[60%] sm:top-[55%] left-3"
      />
      <CarouselNext
        variant={"secondary"}
        className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[60%] sm:top-[55%] right-3"
      />
    </Carousel>
  );
}
