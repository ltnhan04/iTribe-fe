"use client";
import React, { useRef, useEffect } from "react";
import GlowFilter from "@/components/common/glow-filter";
import { animateWithGsap } from "@/utils/animations";
import { cameraControl } from "../../../public/assets/videos/page";

export default function Camera() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      animateWithGsap(headingRef.current, {
        opacity: 1,
        y: 0,
      });
    }

    if (videoContainerRef.current) {
      animateWithGsap(videoContainerRef.current, {
        margin: 80,
        duration: 1,
      });
    }
  }, []);

  return (
    <div className="w-full mx-auto">
      <GlowFilter />
      <h1
        ref={headingRef}
        className=" text-[#c8c2bd] text-center lg:text-6xl md:text-7xl text-3xl font-semibold translate-y-20 opacity-0 py-10 sm:py-14"
      >
        Nắm toàn quyền. <br />
        <span style={{ filter: "url(#glow-1)" }}>Điều Khiển Camera.</span>
      </h1>
      <div className="flex items-center justify-center m-0">
        <div
          className="w-full relative overflow-hidden h-auto sm:h-[75vh] mx-auto"
          ref={videoContainerRef}
        >
          <video
            className="pointer-events-none w-full h-full object-cover rounded-3xl"
            autoPlay
            muted
            playsInline={true}
            loop
          >
            <source src={cameraControl} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
