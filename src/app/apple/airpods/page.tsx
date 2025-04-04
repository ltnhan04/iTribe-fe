"use client";
import React, { Suspense } from "react";
import BreadCrumb from "./components/breadcrumb";
import CarouselAutoPlay from "./components/carousel";
import Categories from "./components/categories";
import Loading from "@/app/loading";

const AirPods = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <BreadCrumb />
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AirPods
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Âm thanh đỉnh cao. Trải nghiệm không dây hoàn hảo.
          </p>
        </div>
        <CarouselAutoPlay />
        <Suspense fallback={<Loading />}>
          <Categories />
        </Suspense>
      </div>
    </div>
  );
};

export default AirPods;
