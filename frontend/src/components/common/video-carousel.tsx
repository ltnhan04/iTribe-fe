"use client";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { hightLightsSlides } from "@/constants/page";
import { Pause, Play, RotateCcw } from "lucide-react";

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<Event[]>([]);

  const { videoId, isPlaying, isLastVideo, startPlay } = video;

  useEffect(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to(`#video-${videoId}`, {
      scrollTrigger: {
        trigger: `#video-${videoId}`,
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [videoId]);

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current[videoId];

    if (span) {
      const anim = gsap.to(span, {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;

            if (videoDivRef.current[videoId]) {
              gsap.to(videoDivRef.current[videoId], {
                width: window.innerWidth < 760 ? "10vw" : "4vw",
              });
            }

            gsap.to(span, {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying && videoDivRef.current[videoId]) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span, {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        if (videoRef.current[videoId]) {
          anim.progress(
            (videoRef.current[videoId]?.currentTime || 0) /
              hightLightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);
  useEffect(() => {
    gsap.fromTo(
      "#text",
      { opacity: 0, scale: 0.8, x: -100 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, [videoId]);
  useEffect(() => {
    if (videoRef.current[videoId - 1]) {
      videoRef.current[videoId - 1]?.pause();
    }
    videoRef.current[videoId]?.play();
  }, [videoId]);

  useEffect(() => {
    if (loadedData.length >= hightLightsSlides.length) {
      if (!isPlaying && videoRef.current[videoId]) {
        videoRef.current[videoId]?.pause();
      } else if (startPlay && videoRef.current[videoId]) {
        videoRef.current[videoId]?.play().catch((error) => {
          console.error("Video play failed:", error);
        });
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type: string, i: number) => {
    switch (type) {
      case "video-end":
        if (i < hightLightsSlides.length - 1) {
          setVideo((prev) => ({ ...prev, videoId: i + 1 }));
        } else {
          setVideo((prev) => ({
            ...prev,
            isLastVideo: true,
            isPlaying: false,
          }));
        }
        break;
      case "video-reset":
        setVideo({
          isEnd: false,
          startPlay: false,
          videoId: 0,
          isLastVideo: false,
          isPlaying: false,
        });
        break;
      case "pause":
        videoRef.current[videoId]?.pause();
        setVideo((prev) => ({ ...prev, isPlaying: false }));
        break;
      case "play":
        videoRef.current[videoId]?.play();
        setVideo((prev) => ({ ...prev, isPlaying: true }));
        break;
      default:
        if (videoRef.current[videoId]) {
          videoRef.current[videoId]?.pause();
        }
        setVideo((prev) => ({ ...prev, videoId: i, startPlay: true }));
        break;
    }
  };

  const handleLoadedMetaData = (
    i: number,
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const nativeEvent = e.nativeEvent;
    setLoadedData((prev) => [...prev, nativeEvent]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightLightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className=" relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
              <div className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-black">
                <video
                  id={`video-${i}`}
                  playsInline
                  preload="auto"
                  muted
                  autoPlay={startPlay}
                  ref={(el) => {
                    videoRef.current[i] = el;
                  }}
                  onEnded={() => handleProcess("video-end", i)}
                  onPlay={() =>
                    setVideo((prev) => ({ ...prev, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div id="text" className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, idx) => (
                  <p
                    key={idx}
                    className="md:text-2xl text-white text-xl font-medium"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-center mt-10">
        <div className="flex items-center justify-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
              onClick={() => {
                if (videoRef.current[videoId]) {
                  videoRef.current[videoId]?.pause();
                }
                setVideo((prev) => ({ ...prev, videoId: i, startPlay: true }));
              }}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>

        <button className="ml-4 p-4 rounded-full bg-gray-300 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform">
          {isLastVideo ? (
            <RotateCcw
              className="w-6 h-6 text-white"
              onClick={() => handleProcess("video-reset", 0)}
            />
          ) : !isPlaying ? (
            <Play
              className="w-6 h-6 text-white"
              onClick={() => handleProcess("play", 0)}
            />
          ) : (
            <Pause
              className="w-6 h-6 text-white"
              onClick={() => handleProcess("pause", 0)}
            />
          )}
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
