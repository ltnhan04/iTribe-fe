import React from "react";
import { Suspense } from "react";
import Loading from "../../../app/loading";
import CarouselAutoPlay from "@/app/(products)/iphone/components/carousel";
import Categories from "@/app/(products)/iphone/components/categories";
import BreadCrumb from "@/components/common/bread-crumb";

const IPhone = () => {
  return (
    <>
      <BreadCrumb />
      <CarouselAutoPlay />
      <Suspense fallback={<Loading />}>
        <Categories />
      </Suspense>
    </>
  );
};

export default IPhone;
