import React from "react";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import BreadCrumb from "@/components/common/bread-crumb";
import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";
import Categories from "@/app/(products)/iphone/components/categories";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="bg-[#f3f4f6] ">
        <div className="container max-w-7xl mx-auto sm:px-10">
          <div className="w-full px-10 py-5">
            <BreadCrumb />
            <CarouselAutoPlay />
            <Categories />
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
