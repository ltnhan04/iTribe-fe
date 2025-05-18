"use client";
import React, { useRef, useEffect, useState } from "react";
import { animateWithGsap } from "@/utils/animations";
import frame from "../../../public/assets/images/frame.png";
import chip from "../../../public/assets/images/highlights_chip_endframe.jpg";
import { jokerBenTre } from "../../../public/assets/videos/page";
import GlowFilter from "@/components/common/glow-filter";
import Image from "next/image";

export default function Chip() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chipRef = useRef<HTMLImageElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (headingRef.current) {
      animateWithGsap(headingRef.current, {
        opacity: 1,
        y: 0,
      });
    }
    if (chipRef.current) {
      animateWithGsap(chipRef.current, {
        opacity: 1,
        y: 0,
        duration: 2,
      });
    }

    if (paragraphRef.current) {
      animateWithGsap(paragraphRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
      });
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoRef.current!.muted = false;
              videoRef
                .current!.play()
                .then(() => {
                  setIsMuted(false);
                })
                .catch((error) => console.error("Error playing video:", error));
            } else {
              videoRef.current!.pause();
              videoRef.current!.muted = true;
              setIsMuted(true);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(videoRef.current);

      return () => {
        if (videoRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          observer.unobserve(videoRef.current);
        }
      };
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="sm:py-16 py-10 sm:px-10 px-5">
      <div className="mx-auto max-w-7xl">
        <div
          ref={chipRef}
          className="flex items-center justify-center w-full my-20 opacity-0 translate-y-20"
        >
          <Image
            src={chip}
            width={500}
            height={500}
            alt="chip"
            className="object-cover"
            priority={true}
            quality={100}
            style={{ width: "auto", height: "100%" }}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <GlowFilter />
          <h1
            ref={headingRef}
            className="text-[#c8c2bd] lg:text-6xl md:text-7xl text-3xl font-semibold translate-y-20 opacity-0 py-10 sm:py-14"
          >
            <span style={{ filter: "url(#glow-1)" }}>A18 Pro.</span>
            <br />
            Con chip <br />
            năng lực khủng.
          </h1>

          <p
            ref={paragraphRef}
            className="text-gray font-semibold text-xl md:text-2xl text-center opacity-0 translate-y-20"
          >
            Khám phá A18 Pro: chip mạnh mẽ phi thường mang lại{" "}
            <strong className="text-white">
              tốc độ và khả năng tiết kiệm điện vượt trội
            </strong>{" "}
            cho iPhone 16 Pro. Chip cũng tăng cường các tính năng chụp ảnh và
            quay video tiên tiến như Điều Khiển Camera, đồng thời mang đến hiệu
            năng đồ họa vượt trội để chơi các game AAA.
          </p>
        </div>

        <div className="mt-10 mb-14">
          <div className="flex items-center justify-center">
            <div className="relative overflow-hidden w-full max-w-4xl">
              <Image
                src={frame}
                alt="frame"
                width={1200}
                height={530}
                priority={true}
                quality={100}
                className="w-full"
              />

              <div className="absolute inset-0 w-[95%] h-[90%] rounded-[56px] overflow-hidden top-[6.5%] left-[2.5%]">
                <video
                  className="w-full h-full object-cover"
                  playsInline
                  preload="none"
                  loop
                  ref={videoRef}
                  muted={isMuted}
                  controls
                >
                  <source src={jokerBenTre} type="video/mp4" />
                </video>
                <button
                  onClick={toggleMute}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-md"
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
