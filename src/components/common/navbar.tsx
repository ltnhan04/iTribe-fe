import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShoppingCart } from "lucide-react";

import React from "react";

export default function Navbar() {
  return (
    <div className="container max-w-7xl mx-auto sm:px-5">
      <div className="w-full px-5 sm:px-10 py-5 flex items-center justify-between">
        <nav className="flex items-center justify-between w-full">
          <Link href={"/"}>
            <Image
              src={"/assets/images/i-Tribe-logo.png"}
              width={64}
              height={64}
              className="cursor-pointer w-12 h-12 "
              priority={true}
              alt="iTribe logo"
              quality={100}
            />
          </Link>
          <Link href={"/iphone"}>
            <p className="px-5 text-sm cursor-pointer text-gray font-semibold hover:text-white transition-all">
              iPhone
            </p>
          </Link>

          <div className="flex items-center gap-5 text-white">
            <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <User className="w-5 h-5 sm:h-6 sm:w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuGroup>
                  <Link href={"/login"}>
                    <DropdownMenuItem className="cursor-pointer">
                      Đăng nhập
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/register"}>
                    <DropdownMenuItem className="cursor-pointer">
                      Đăng ký
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </div>
  );
}
