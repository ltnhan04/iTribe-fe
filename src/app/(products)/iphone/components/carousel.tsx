import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { carousel } from "@/constants/page";
import Image from "next/image";

export default function CarouselAutoPlay() {
  return (
    <Carousel className="relative">
      <CarouselContent>
        {carousel.map((_, index) => (
          <CarouselItem key={index}>
            <div className="relative mt-5 sm:mt-7 w-full h-20 sm:h-80">
              <Image
                src={carousel[index]}
                alt="image"
                layout="fill"
                className=" rounded-xl"
                quality={100}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant={"secondary"}
        className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[55%] left-3"
      />
      <CarouselNext
        variant={"secondary"}
        className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-[55%] right-3"
      />
    </Carousel>
  );
}
