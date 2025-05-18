"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { MutableRefObject } from "react";
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger);

interface AnimationProps {
  duration?: number;
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  [key: string]: unknown;
}

interface ScrollProps {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  [key: string]: unknown;
}

export const animateWithGsap = (
  target: HTMLElement | string,
  animationProps: AnimationProps,
  scrollProps?: ScrollProps
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: MutableRefObject<THREE.Object3D>,
  rotationState: number,
  firstTarget: gsap.TweenTarget,
  secondTarget: gsap.TweenTarget,
  animationProps: AnimationProps
) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
