import Image from "next/image";
import { User, ShoppingCart } from "lucide-react";

import React from "react";

export default function Navbar() {
  return (
    <div className="container max-w-7xl mx-auto sm:px-5">
      <div className="w-full px-5 sm:px-10 py-5 flex items-center justify-between">
        <nav className="flex items-center justify-between w-full">
          <Image
            src={"/assets/images/i-Tribe-logo.png"}
            width={64}
            height={64}
            className="cursor-pointer w-12 h-12 sm:h-16 sm:w-16"
            priority={true}
            alt="iTribe logo"
            quality={100}
          />
          <p className="px-5 text-sm cursor-pointer text-gray font-semibold hover:text-white transition-all">
            iPhone
          </p>
          <div className="flex items-center gap-5 text-white">
            <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
            <User className="w-5 h-5 sm:h-6 sm:w-6" />
          </div>
        </nav>
      </div>
    </div>
  );
}
