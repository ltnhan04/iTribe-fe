import { SlashIcon } from "@radix-ui/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const BreadCrumb = () => {
  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList className="font-medium text-[10px] sm:text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-black transition-colors duration-300 ease-out hover:text-blue"
            href="/"
          >
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink className="text-black transition-colors duration-300 ease-out hover:text-blue">
            Giỏ hàng
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink className="text-black transition-colors duration-300 ease-out hover:text-blue">
            Thanh toán
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
