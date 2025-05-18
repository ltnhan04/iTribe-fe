"use client";

import Link from "next/link";
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { hero } from "../../../public/assets/videos/page";

export default function Hero() {
  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 2 });
    gsap.to("#cta", { opacity: 1, y: -50, delay: 2 });
  }, []);

  return (
    <div className="container max-w-7xl mx-auto sm:px-5">
      <div className="w-full h-[calc(100vh-60px)] bg-black">
        <div className="h-5/6 w-full flex flex-col items-center justify-center md:mt-10">
          <p
            id="hero"
            className="text-center text-xl md:text-[28px] font-medium text-white opacity-0 mt-10"
          >
            iPhone 16 Pro
          </p>

          <div className="w-full md:w-9/12 lg:w-10/12">
            <video
              className="pointer-events-none w-full h-auto"
              autoPlay
              muted
              playsInline={true}
            >
              <source src={hero} type="video/mp4" />
            </video>
          </div>
        </div>

        <div
          id="cta"
          className="flex flex-col items-center opacity-0 translate-y-20"
        >
          <Link
            href={"/iphone"}
            className="px-4 py-2 md:px-5 md:py-2 rounded-3xl text-sm md:text-lg text-white bg-blue my-5 transition-colors duration-200 ease-in-out hover:bg-transparent border border-transparent hover:border-blue hover:text-blue"
          >
            Mua
          </Link>

          <p className="font-normal text-sm md:text-lg text-white text-center px-4">
            Từ 28.999.000đ hoặc 1.181.000đ/tháng. Trong 24 tháng.
          </p>
        </div>
      </div>
    </div>
  );
}
