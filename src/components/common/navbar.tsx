"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { User, ShoppingCart, Heart, UserCheck } from "lucide-react";

import { useAccessTokenExpired } from "@/utils/expired-token";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { logout } from "@/api/services/auth/authApi";
import { clearAccessToken } from "@/lib/features/authentication/authSlice";

import type { ErrorType } from "@/app/type";

interface NavbarProps {
  isFixed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isFixed }) => {
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dispatch = useAppDispatch();
  const {
    cart: { cart },
    wishlist: { wishlists },
  } = useAppSelector((state) => state);
  const isTokenExpired = useAccessTokenExpired();

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

              <Link className="flex flex-1 justify-center" href={"/iphone"}>
                <p className="text-sm cursor-pointer text-gray font-semibold hover:text-white transition-all">
                  iPhone
                </p>
              </Link>

              <div className="flex items-center w-fit gap-2 sm:gap-4 text-white relative">
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
                          <Link href={"/chatbox"}>
                            <DropdownMenuItem className="cursor-pointer">
                              Hỗ trợ
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
