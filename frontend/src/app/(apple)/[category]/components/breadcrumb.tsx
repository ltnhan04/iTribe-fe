import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const Breadcrumb: React.FC = (): React.ReactElement => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      label: (
        <div className="flex items-center text-gray-500 hover:text-gray-700 font-semibold text-sm">
          <Home className="w-4 h-4 mr-1" color="black" />
          Trang chủ
        </div>
      ),
      href: "/",
    },
    ...paths.map((segment, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label = segment.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");

      return {
        label,
        href,
      };
    }),
  ];

  return (
    <nav className="flex items-center pb-4 overflow-x-auto whitespace-nowrap">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-800 flex-shrink-0 font-semibold" />
            )}
            {isLast ? (
              <span className="text-gray-900 font-medium truncate text-sm">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors truncate font-semibold text-sm"
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
