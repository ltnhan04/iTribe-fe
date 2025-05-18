import Image from "next/image";
import React from "react";
import Link from "next/link";
import { footerLinks } from "@/constants/page";

export default function Footer() {
  return (
    <div className="container max-w-7xl mx-auto sm:px-10">
      <div className="w-full py-5 px-5">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <div className="w-10 h-10 md:w-12 md:h-12 relative">
              <Image
                src={"/assets/images/i-Tribe-logo.png"}
                className="cursor-pointer w-12 h-12 object-contain "
                priority={true}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px), 48px"
                alt="iTribe logo"
                quality={100}
              />
            </div>
          </Link>

          <div>
            <div className="flex items-center justify-center">
              {footerLinks.map((link, index) => (
                <Link
                  href={"https://github.com/ltnhan04/iTribe-fe"}
                  target="_blank"
                  key={index}
                  className="font-semibold text-gray text-xs hover:underline hover:text-gray-200"
                >
                  {link}{" "}
                  {index !== footerLinks.length - 1 && (
                    <span className="mx-2">|</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-neutral-700 h-[1px] my-5 w-full"></div>
        <p className="font-semibold text-gray text-xs text-center">
          Copright @ 2024 Nhan Luong. All rights reserved.
        </p>
      </div>
    </div>
  );
}
