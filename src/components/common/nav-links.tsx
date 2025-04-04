"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  {
    id: "iphone",
    name: "iPhone",
    href: "/apple/iphone",
  },
  {
    id: "macbook",
    name: "MacBook",
    href: "/apple/macbook",
  },
  {
    id: "ipad",
    name: "iPad",
    href: "/apple/ipad",
  },
  {
    id: "airpods",
    name: "AirPods",
    href: "/apple/airpods",
  },
  {
    id: "applewatch",
    name: "Apple Watch",
    href: "/apple/applewatch",
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const currentCategory = pathname.split("/")[2];

  return (
    <div className="flex flex-1 justify-center gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className={`text-sm cursor-pointer font-semibold transition-all ${
            currentCategory === category.id
              ? "text-white"
              : "text-gray hover:text-white"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
