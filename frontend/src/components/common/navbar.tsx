"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCategory } from "@/hooks/useCategories";
import { User, ShoppingCart, Heart, UserCheck, Search } from "lucide-react";

import { useAccessTokenExpired } from "@/utils/expired-token";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { APPLE_CATEGORIES } from "@/constants/categories";

import { logout } from "@/services/auth/authApi";
import { clearAccessToken } from "@/lib/features/authentication/authSlice";

import { ErrorType } from "@/types/common";

const Navbar = ({ isFixed }: { isFixed?: boolean }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { data: categories } = useCategory();
  const { toast } = useToast();
  const isTokenExpired = useAccessTokenExpired();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const currentCategory = pathname.split("/")[2];

  const cart = useAppSelector((state) => state.cart.cart);
  const wishlists = useAppSelector((state) => state.wishlist.wishlists);
  const cartItemCount = cart.length;
  const wishlistItemCount = wishlists.length;

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearAccessToken());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi!",
        description: (error as ErrorType).response.data.message,
      });
    }
  };

  return (
    <>
      <div
        className={`bg-black w-full ${
          isFixed ? " fixed top-0 left-0 right-0 z-10" : " "
        } `}
      >
        <div className="container max-w-7xl mx-auto sm:px-10">
          <div className="w-full px-5 py-5 flex items-center justify-between">
            <nav className="flex items-center w-full">
              <Link className="w-fit" href={"/"}>
                <div className=" w-10 h-10 md:w-12 md:h-12 relative">
                  <Image
                    src={"/assets/images/i-Tribe-logo.png"}
                    className="cursor-pointer w-12 h-12 object-contain"
                    priority={true}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 48px"
                    alt="iTribe logo"
                    quality={100}
                  />
                </div>
              </Link>

              <div className="flex flex-1 justify-center gap-6 ml-28">
                {categories &&
                  categories.map((category) => {
                    const appleCategory = APPLE_CATEGORIES.find(
                      (c) =>
                        c.name.toLowerCase() === category.name.toLowerCase()
                    );

                    return (
                      <Link
                        key={category._id}
                        href={appleCategory ? appleCategory.href : "#"}
                        className={`text-sm cursor-pointer font-semibold transition-all ${
                          currentCategory === category._id
                            ? "text-white"
                            : "text-gray hover:text-white"
                        }`}
                      >
                        {category.name}
                      </Link>
                    );
                  })}
              </div>
              <div className="flex items-center w-fit gap-2 sm:gap-4 text-white relative">
                <span>
                  <Search className="w-5 h-5 sm:h-6 sm:w-6" />
                </span>
                <Link href={"/cart"} className="relative">
                  <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link href={"/wishlists"} className="relative">
                  <Heart className="w-5 h-5 sm:h-6 sm:w-6" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>

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
                          <Link href={"/exchange-voucher"}>
                            <DropdownMenuItem className="cursor-pointer">
                              Điểm tích lũy
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setShowLogoutDialog(true)}
                          >
                            Đăng xuất
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
