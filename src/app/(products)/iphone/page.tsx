import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";
import Categories from "@/app/(products)/iphone/components/categories";
import BreadCrumb from "@/components/common/bread-crumb";
import React from "react";

const IPhone = () => {
  return (
    <>
      <BreadCrumb />
      <CarouselAutoPlay />
      <Categories />
    </>
  );
};

export default IPhone;
