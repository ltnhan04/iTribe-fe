"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  productName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName }) => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      label: (
        <div className="flex items-center text-gray-500 hover:text-gray-700">
          <Home className="w-4 h-4 mr-1" />
          Trang chủ
        </div>
      ),
      href: "/",
    },
    {
      label: "Apple",
      href: "/apple",
    },
    {
      label: "AirPods",
      href: "/apple/airpods",
    },
  ];

  if (productName) {
    breadcrumbItems.push({
      label: productName,
      href: pathname,
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-8">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {isLast ? (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 