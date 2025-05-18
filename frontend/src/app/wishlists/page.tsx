/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Trash2, ShoppingCart, LoaderCircle } from "lucide-react";

import BreadCrumb from "@/app/wishlists/components/bread-crumb";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeFromWishlist } from "@/lib/features/wishlists/wistlistSlice";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { WishlistType } from "@/types/wishlist";
const wishlistImage = "/assets/images/wishlist.png";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    [id: string]: boolean;
  }>({});
  const [loadingState, setLoadingState] = useState<{
    [id: string]: "adding" | "deleting" | null;
  }>({});

  const wishlistItems: WishlistType[] = useAppSelector(
    (state) => state.wishlist.wishlists
  );

  const handleAddToCart = (item: WishlistType) => {
    setLoadingState((prev) => ({ ...prev, [item.id]: "adding" }));
    setTimeout(() => {
      dispatch(addToCart({ ...item, quantity: item.quantity ?? 1 }));
      dispatch(removeFromWishlist(item.id));
      setLoadingState((prev) => ({ ...prev, [item.id]: null }));
    }, 1000);
  };

  const handleRemoveFromWishlist = (id: string) => {
    setLoadingState((prev) => ({ ...prev, [id]: "deleting" }));
    setTimeout(() => {
      dispatch(removeFromWishlist(id));
      setLoadingState((prev) => ({ ...prev, [id]: null }));
    }, 1000);
  };

  return (
    <div className="container mx-auto min-h-[100vh]">
      <BreadCrumb />
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <div className=" w-[200px] h-[200px] md:w-[350px] md:h-[350px] relative">
            <Image
              src={wishlistImage}
              alt="wishlist"
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className=" object-contain rounded-xl"
            />
          </div>
          <p className="text-gray-600 mb-8">
            Thêm các mặt hàng vào danh sách yêu thích của bạn để theo dõi các
            sản phẩm bạn quan tâm.
          </p>
          <Button onClick={() => router.push("/iphone")}>
            Tiếp tục mua sắm nhé!
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item: WishlistType) => (
            <Card
              key={item.id}
              className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg bg-white"
            >
              <CardContent className="pt-6 flex flex-col items-center justify-between gap-3">
                <div className="relative h-56 w-full max-w-[500px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base mt-3 text-gray-800 line-clamp">
                    {item.name}
                  </h3>
                  <p className="font-medium text-sm my-2">
                    {item.price.toLocaleString()} VND
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <AlertDialog
                      open={!!showConfirmDialog[item.id]}
                      onOpenChange={(open) => {
                        setShowConfirmDialog((prev) => ({
                          ...prev,
                          [item.id]: open,
                        }));
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            loadingState[item.id] === "adding" ||
                            loadingState[item.id] === "deleting"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xác nhận xóa khỏi danh sách
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa khỏi danh sách yêu thích
                            không?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setShowConfirmDialog((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }))
                            }
                            disabled={
                              loadingState[item.id] === "adding" ||
                              loadingState[item.id] === "deleting"
                            }
                          >
                            Hủy
                          </Button>
                          <Button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="text-white"
                            disabled={
                              loadingState[item.id] === "adding" ||
                              loadingState[item.id] === "deleting"
                            }
                          >
                            {loadingState[item.id] === "deleting" ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              "Xác nhận"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button size="sm" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="w-4 h-4" />
                      {loadingState[item.id] === "adding" ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Thêm vào giỏ hàng"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
