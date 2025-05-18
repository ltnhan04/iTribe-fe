/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { LoaderCircle, Minus, Plus, Trash2 } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateCart } from "@/lib/features/cart/cartSlice";
import { CartType } from "@/types/cart";
import BreadCrumb from "@/app/cart/components/bread-crumb";
const emptyCart = "/assets/images/empt-cart.jpg";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    [id: string]: boolean;
  }>({});
  const cartArray: CartType[] = useAppSelector((state) => state.cart.cart);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 20) return;
    const updatedCart = cartArray.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    dispatch(updateCart(updatedCart));
  };

  const removeItem = (id: string) => {
    setIsDeleting(true);
    setTimeout(() => {
      const updatedCart = cartArray.filter((item: CartType) => item.id !== id);
      dispatch(updateCart(updatedCart));
      setIsDeleting(false);
    }, 2000);
  };

  const calculateTotal = () => {
    const total = cartArray.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return total;
  };

  const handleCheckout = () => {
    setIsUpdating(true);
    dispatch(updateCart(cartArray));
    setTimeout(() => {
      router.push("/cart/checkout");
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 min-h-[100vh]">
      <BreadCrumb />
      {cartArray.length === 0 ? (
        <div className="flex flex-col items-center">
          <div className=" w-[200px] h-[200px] md:w-[350px] md:h-[350px] relative">
            <Image
              src={emptyCart}
              alt="empty cart"
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className=" object-contain rounded-xl"
            />
          </div>
          <p className="text-gray-600 mb-8">
            Chưa có sản phẩm nào trong giỏ hàng hết bạn ơi !
          </p>
          <Button onClick={() => router.push("/iphone")}>
            Tiếp tục mua sắm nhé!
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartArray.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col md:flex-row justify-between gap-3 items-center p-4">
                  <div className="flex items-center justify-between">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
                        className="object-contain rounded-md"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.price.toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <Minus className={`h-4 w-4 `} />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Math.min(parseInt(e.target.value), 20)
                          )
                        }
                        className="text-xs w-10 md:w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={item.quantity === 20}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="ml-4 text-right flex items-center">
                      <p className="font-semibold text-xs md:text-base">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </p>
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
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xác nhận xóa sản phẩm khỏi giỏ hàng
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa khỏi giỏ hàng không?
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
                              disabled={isDeleting || isUpdating}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={() => removeItem(item.id)}
                              className="text-white"
                              disabled={isDeleting || isUpdating}
                            >
                              {isDeleting ? (
                                <LoaderCircle className="animate-spin" />
                              ) : (
                                "Xác nhận"
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-sm md:text-lg font-semibold">Tổng đơn hàng:</p>
              <p className="text-sm md:text-2xl font-bold">
                {calculateTotal().toLocaleString()} VND
              </p>
            </div>
            <Button size="lg" onClick={handleCheckout} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <LoaderCircle className="animate-spin" />{" "}
                  <div>Chờ tí nhé...</div>
                </>
              ) : (
                "Tiến hành thanh toán"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
