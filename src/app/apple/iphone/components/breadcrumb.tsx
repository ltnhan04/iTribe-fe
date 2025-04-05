import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  productName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  productName,
}): React.ReactElement => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const formatProductName = (segment: string): string => {
    const parts = segment.split("-");
    const storage = parts[parts.length - 1];
    const name = parts.slice(0, -1).join(" ");

    if (storage && storage.toLowerCase().includes("gb")) {
      return `${name.toUpperCase()} ${storage.toUpperCase()}`;
    }
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getLabel = (
    segment: string,
    index: number,
    isLast: boolean
  ): string | React.ReactNode => {
    if (isLast && productName) return productName;

    const labels: { [key: string]: string } = {
      apple: "Apple",
      iphone: "iPhone",
      ipad: "iPad",
      macbook: "MacBook",
      airpods: "AirPods",
    };

    if (isLast) {
      return formatProductName(segment);
    }

    return (
      labels[segment.toLowerCase()] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

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
    ...paths.map((segment, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const isLast = index === paths.length - 1;
      const label = getLabel(segment, index, isLast);

      return {
        label,
        href,
      };
    }),
  ];

  return (
    <nav className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
            )}
            {isLast ? (
              <span className="text-gray-900 font-medium truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors truncate"
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
