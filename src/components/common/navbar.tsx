"use client";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccessTokenExpired } from "@/utils/expired-token";
import { User, ShoppingCart, Heart, UserCheck } from "lucide-react";
import React from "react";

export default function Navbar() {
  const isTokenExpired = useAccessTokenExpired();

  return (
    <div className="container max-w-7xl mx-auto sm:px-10">
      <div className="w-full px-5 py-5 flex items-center justify-between">
        <nav className="flex items-center w-full">
          <Link className="w-fit" href={"/"}>
            <Image
              src={"/assets/images/i-Tribe-logo.png"}
              width={48}
              height={48}
              className="cursor-pointer w-12 h-12 object-contain"
              priority={true}
              alt="iTribe logo"
              quality={100}
            />
          </Link>

          <Link className=" flex flex-1 justify-center" href={"/iphone"}>
            <p className=" text-sm cursor-pointer text-gray font-semibold hover:text-white transition-all">
              iPhone
            </p>
          </Link>

          <div className="flex items-center w-fit gap-2 sm:gap-4 text-white">
            <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
            <Heart className="w-5 h-5 sm:h-6 sm:w-6" />

            <DropdownMenu>
              <DropdownMenuTrigger>
                {isTokenExpired ? (
                  <User className="w-5 h-5 sm:h-6 sm:w-6" />
                ) : (
                  <UserCheck className="w-5 h-5 sm:h-6 sm:w-6" />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-36">
                <DropdownMenuGroup>
                  {isTokenExpired ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Link href={"/profile"}>
                        <DropdownMenuItem className="cursor-pointer">
                          Tài khoản
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/orders"}>
                        <DropdownMenuItem className="cursor-pointer">
                          Đơn hàng
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/logout"}>
                        <DropdownMenuItem className="cursor-pointer">
                          Đăng xuất
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </div>
  );
}
