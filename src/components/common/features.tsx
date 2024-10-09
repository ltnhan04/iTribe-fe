"use client";
import React, { useRef, useEffect } from "react";
import GlowFilter from "@/components/common/glow-filter";
import { animateWithGsap } from "@/utils/animations";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Design() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingRef1 = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const paraRef1 = useRef<HTMLParagraphElement>(null);
  const paraRef2 = useRef<HTMLParagraphElement>(null);
  const paraRef3 = useRef<HTMLParagraphElement>(null);
  const paraRef4 = useRef<HTMLParagraphElement>(null);
  const imageRef1 = useRef<HTMLImageElement>(null);
  const imageRef2 = useRef<HTMLImageElement>(null);
  const imageRef3 = useRef<HTMLImageElement>(null);

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
    if (imageRef1.current) {
      animateWithGsap(imageRef1.current, {
        scale: 1.05,
        duration: 1,
      });
    }
    if (imageRef2.current) {
      animateWithGsap(imageRef2.current, {
        scale: 1.2,
        duration: 1,
      });
    }
    if (imageRef3.current) {
      animateWithGsap(imageRef3.current, {
        scale: 1.2,
        duration: 1,
      });
    }
    if (paraRef1.current) {
      animateWithGsap(paraRef1.current, { x: 0, opacity: 1, duration: 1 });
    }
    if (paraRef2.current) {
      animateWithGsap(paraRef2.current, { x: 0, opacity: 1, duration: 1 });
    }
    if (paraRef3.current) {
      animateWithGsap(paraRef3.current, { x: 0, opacity: 1, duration: 1 });
    }
    if (paraRef4.current) {
      animateWithGsap(paraRef4.current, { x: 0, opacity: 1, duration: 1 });
    }
    if (headingRef1.current) {
      animateWithGsap(headingRef1.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }, []);

  return (
    <section className="w-full h-full">
      <div className="sm:pt-32 pt-20 sm:px-10 px-5">
        <div className="mx-auto relative max-w-7xl">
          <GlowFilter />
          <div>
            <h1
              ref={headingRef}
              className="text-[#c8c2bd] text-center lg:text-6xl md:text-7xl text-3xl lg:mb-0 mb-5 font-semibold opacity-0 translate-y-20 py-3 "
            >
              Mạnh. Đẹp. <br />{" "}
              <span style={{ filter: "url(#glow-1)" }} className="ml-4">
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
      </div>

      <div className="relative opacity-0 translate-y-20" ref={imageRef}>
        <Image
          src={"/assets/images/design_hero_endframe.jpg"}
          alt="design hero"
          width={1920}
          height={1080}
          quality={100}
          priority={true}
        />
      </div>

      <div className="sm:py-16 py-12 sm:px-10 px-10 ml-10">
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

      <div className="sm:py-16 py-12 sm:px-20 px-10">
        <div className="mx-auto max-w-7xl relative">
          <div className="flex flex-col items-center justify-between overflow-hidden">
            <h2
              ref={headingRef1}
              className="text-3xl text-center lg:text-5xl font-semibold text-white z-10 opacity-0 translate-y-20"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#efcdbb,#dab8a4 50%,#a3735e)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Titan Cấp 5 cao cấp cực kỳ bền bỉ.
            </h2>

            <div className="flex items-center justify-center flex-col pb-10">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-x-10">
                <div
                  className="flex-1 scale-100 overflow-hidden"
                  ref={imageRef1}
                >
                  <Image
                    src={"/assets/images/recycle.jpg"}
                    alt="titan cap 5"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    quality={100}
                    priority={true}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-5 mt-10 sm:mt-0">
                  <p
                    className="text-base sm:text-xl font-semibold text-white z-10 opacity-0 translate-x-20"
                    ref={paraRef3}
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg,#efcdbb,#dab8a4 50%,#a3735e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Công nghệ màn hình mới cho phép chúng tôi định tuyến dữ liệu
                    hiển thị dưới các điểm ảnh hoạt động mà không bị biến dạng,
                    giúp{" "}
                    <strong className="text-white">
                      màn hình Super Retina XDR
                    </strong>{" "}
                    6,3 inch và 6,9 inch lớn hơn có viền mỏng hơn, đem đến cảm
                    giác tuyệt vời khi cầm trên tay.
                  </p>
                  <p
                    className="text-base sm:text-xl font-semibold text-white z-10 opacity-0 translate-x-20"
                    ref={paraRef4}
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg,#efcdbb,#dab8a4 50%,#a3735e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    iPhone 16 Pro có khả năng chống tia nước, chống nước và
                    chống bụi. Thiết bị cũng{" "}
                    <strong className="text-white">
                      bền chắc đáng kinh ngạc
                    </strong>
                    , với chất liệu Ceramic Shield thế hệ mới nhất. Chuẩn mực về
                    sự bền bỉ.
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="w-full flex flex-col md:flex-row gap-5 items-center">
                  <div
                    className="overflow-hidden flex-1 h-[50vh] scale-100"
                    ref={imageRef2}
                  >
                    <Image
                      width={400}
                      height={400}
                      src={"/assets/images/display_medium.jpg"}
                      alt="titanium"
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                  <div
                    className="overflow-hidden flex-1 h-[50vh] scale-100"
                    ref={imageRef3}
                  >
                    <Image
                      width={400}
                      height={400}
                      src={"/assets/images/thin.jpg"}
                      alt="titanium 2"
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
