"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "@/constants/page";

const Categories = () => {
  const router = useRouter();
  const pathName = usePathname();
  const bottomRef = useRef<HTMLSpanElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (pathName) {
      const currentSlug = pathName.split("/").pop();
      const findIndex = categories.findIndex(
        (value) => value.url === currentSlug
      );
      if (findIndex !== -1) {
        setSelectedIndex(findIndex);
      }
    }
  }, [pathName]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.classList.add(
        "border-b-2",
        "border-blue",
        "!text-blue"
      );
    }
  }, []);

  const handleSlugChange = (slug: string, index: number) => {
    setSelectedIndex(index);
    router.push(`/iphone/${slug}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center py-2 mt-4 gap-3 sm:gap-5">
        {categories.map((value, index) => (
          <span
            key={index}
            onClick={() => handleSlugChange(value.url, index)}
            ref={index === 0 ? bottomRef : null}
            className={` ${
              index === selectedIndex
                ? "!text-blue border-b-2 !border-blue"
                : ""
            } text-sm text-black py-1 font-medium transition-colors duration-300 ease-out hover:text-blue cursor-pointer border-b-2 border-transparent hover:border-blue`}
          >
            {value.category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Categories;
