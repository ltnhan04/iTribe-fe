"use client";
import React, { useRef, useEffect } from "react";
import GlowFilter from "@/components/common/glow-filter";
import { animateWithGsap } from "@/utils/animations";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Design() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const paraRef1 = useRef<HTMLParagraphElement>(null);
  const paraRef2 = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      animateWithGsap(headingRef.current, {
        y: 0,
        opacity: 1,
        ease: "power2.inOut",
      });
    }
    if (imageRef.current) {
      animateWithGsap(imageRef.current, { y: 0, opacity: 1, duration: 1 });
    }
    if (paraRef1.current) {
      animateWithGsap(paraRef1.current, { x: 0, opacity: 1, duration: 1 });
    }
    if (paraRef2.current) {
      animateWithGsap(paraRef2.current, { x: 0, opacity: 1, duration: 1 });
    }
  }, []);

  return (
    <section className="w-full h-full">
      <div className="sm:pt-32 pt-20 sm:px-10 px-5">
        <div className="mx-auto relative max-w-7xl">
          <GlowFilter />
          <h1
            ref={headingRef}
            className="text-[#c8c2bd] text-center lg:text-6xl md:text-7xl text-3xl lg:mb-0 mb-5 font-semibold opacity-0 translate-y-20 py-3"
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
      <div className="relative opacity-0 translate-y-20" ref={imageRef}>
        <Image
          src={"/assets/images/design_hero_endframe.jpg"}
          alt="design hero"
          width={1920}
          height={1080}
          quality={100}
          priority={true}
          layout="responsive"
        />
      </div>
      <div className="sm:py-16 py-12 sm:px-10 px-10">
        <div className="text-gray w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-10 sm:gap-[25%] text-xl sm:text-2xl font-medium">
          <p className="opacity-0 -translate-x-20" ref={paraRef1}>
            iPhone 16 Pro có thiết kế titan Cấp 5 với lớp hoàn thiện mới, tinh
            tế được xử lý bề mặt vi điểm. Titan là một trong những kim loại có
            tỷ số độ bền và trọng lượng cao nhất, giúp phiên bản này{" "}
            <strong className="text-white">
              cực kỳ cứng cáp và nhẹ ấn tượng
            </strong>
            . iPhone 16 Pro có bốn màu tuyệt đẹp, bao gồm màu Titan Sa Mạc mới.
          </p>
          <p className="opacity-0 translate-x-20" ref={paraRef2}>
            Các cải tiến thiết kế bên trong (như cấu trúc tản nhiệt bên dưới
            được làm từ 100% nhôm tái chế và mặt kính sau với những đặc tính tối
            ưu giúp tản nhiệt hiệu quả hơn) cho phép{" "}
            <strong className="text-white">duy trì hiệu suất tốt hơn</strong>{" "}
            20% so với iPhone 15 Pro. Nhờ đó, bạn có thể làm mọi điều mình
            thích, như chơi game cường độ cao được lâu hơn.
          </p>
        </div>
      </div>
    </section>
  );
}
