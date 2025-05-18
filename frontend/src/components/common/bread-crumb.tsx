import { SlashIcon } from "@radix-ui/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadCrumbProps {
  slug?: string;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ slug }) => {
  return (
    <Breadcrumb>
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
          <BreadcrumbLink
            className="text-black transition-colors duration-300 ease-out hover:text-blue"
            href="/iphone"
          >
            iPhone
          </BreadcrumbLink>
        </BreadcrumbItem>

        {slug && (
          <>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-black transition-colors duration-300 ease-out hover:text-blue"
                href={`/${slug}`}
              >
                {slug}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
