"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { CirclePlay } from "lucide-react";
import { animateWithGsap } from "@/utils/animations";
import VideoCarousel from "@/components/common/video-carousel";

export default function HighLights() {
  const router = useRouter();
  useGSAP(() => {
    animateWithGsap("#watch", { opacity: 1, y: 0, duration: 1 });
    animateWithGsap("#title", { opacity: 1, y: 0 });
  });
  return (
    <div className="w-full overflow-hidden h-full sm:py-32 py-20 px-5 bg-zinc">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 w-full md:flex items-center justify-between">
          <h2
            id="title"
            className="text-white lg:text-5xl md:text-4xl text-2xl lg:mb-0 mb-5 font-semibold opacity-0 translate-y-20"
          >
            Các điểm nổi bật.
          </h2>
          <p
            id="watch"
            className="text-blue hover:underline cursor-pointer flex items-center text-base opacity-0 translate-y-20"
            onClick={() =>
              router.push("https://youtu.be/eDqfg_LexCQ?si=xWmSqhgsLJ8HYOv3")
            }
          >
            Xem Phim
            <CirclePlay className="ml-2" size={20} />
          </p>
        </div>
        <VideoCarousel />
      </div>
    </div>
  );
}
