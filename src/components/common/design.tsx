"use client";
import React, { useRef, useEffect } from "react";
import GlowFilter from "@/components/common/glow-filter";
import { animateWithGsap } from "@/utils/animations";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Design() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      animateWithGsap(headingRef.current, { y: 0, opacity: 1 });
    }
  }, []);

  return (
    <section className="w-full h-full">
      <div className="sm:pt-32 pt-20 sm:px-10 px-5">
        <div className="mx-auto relative max-w-7xl">
          <GlowFilter />
          <h1
            ref={headingRef}
            className="text-[#c8c2bd] text-center lg:text-6xl md:text-7xl text-3xl lg:mb-0 mb-5 font-semibold opacity-0 translate-y-20"
          >
            Mạnh. Đẹp. <br />
            <span style={{ filter: "url(#glow-1)" }}>
              <Typewriter
                words={["Bằng Titan."]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={70}
                delaySpeed={2000}
              />
            </span>
          </h1>
        </div>
      </div>
      <Image
        src={"/assets/images/design_hero_endframe.jpg"}
        alt="design hero"
        width={1920}
        height={1080}
        quality={100}
        priority={true}
        layout="responsive"
      />
    </section>
  );
}
