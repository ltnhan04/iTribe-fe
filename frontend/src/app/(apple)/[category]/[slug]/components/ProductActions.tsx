"use client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductResponse } from "@/types/slug";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, removeToCart } from "@/lib/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlists/wistlistSlice";
import { useToast } from "@/hooks/use-toast";
import { CartType } from "@/types/cart";
import { WishlistType } from "@/types/wishlist";

interface ProductActionsProps {
  variant: ProductResponse;
}

export default function ProductActions({ variant }: ProductActionsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const cart = useAppSelector((state) => state.cart);
  const wishlist = useAppSelector((state) => state.wishlist);

  const isProductInCart = variant
    ? cart.cart.some((item: CartType) => item.id === variant._id)
    : false;

  const isProductInWishlist = variant
    ? wishlist.wishlists.some((item: WishlistType) => item.id === variant._id)
    : false;

  const handleAddOrRemoveFromCart = () => {
    if (!variant?._id) return;

    if (isProductInCart) {
      dispatch(removeToCart(variant._id));
      toast({
        title: "Đã xóa khỏi giỏ hàng",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng của bạn",
      });
    } else {
      const cartItem = {
        id: variant._id,
        name: `${variant.name} - ${variant.color.colorName} - ${variant.storage}`,
        image: variant.images[0],
        price: variant.price,
        quantity: 1,
        storage: variant.storage,
        color: variant.color.colorName,
        status: variant.stock > 0 ? "in stock" : "out of stock",
      };
      dispatch(addToCart(cartItem));
      toast({
        title: "Thêm vào giỏ hàng",
        description: "Sản phẩm đã được thêm vào giỏ hàng của bạn",
      });
    }
  };

  const handleAddOrRemoveFromWishlist = () => {
    if (!variant?._id) return;

    if (isProductInWishlist) {
      dispatch(removeFromWishlist(variant._id));
      toast({
        title: "Đã xóa khỏi wishlist",
        description: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      const wishlistItem = {
        id: variant._id,
        name: `${variant.name} - ${variant.color.colorName} - ${variant.storage}`,
        image: variant.images[0],
        price: variant.price,
        quantity: 1,
        storage: variant.storage,
        color: variant.color.colorName,
      };
      dispatch(addToWishlist(wishlistItem));
      toast({
        title: "Đã thêm vào wishlist",
        description: "Sản phẩm đã được thêm vào danh sách yêu thích",
      });
    }
  };

  const handleBuyNow = () => {
    if (!isProductInCart) {
      handleAddOrRemoveFromCart();
    }
    const cartItem = {
      id: variant._id,
      name: `${variant.name} - ${variant.color.colorName} - ${variant.storage}`,
      image: variant.images[0],
      price: variant.price,
      quantity: 1,
      storage: variant.storage,
      color: variant.color.colorName,
      status: variant.stock > 0 ? "in stock" : "out of stock",
    };
    dispatch(addToCart(cartItem));
    router.push("/cart/checkout");

    toast({
      title: "Chuyển đến trang thanh toán",
      description: "Vui lòng hoàn tất thông tin thanh toán",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleBuyNow}
        disabled={variant.stock === 0}
        className="w-full bg-black hover:bg-gray-900 text-white rounded-lg py-3 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Mua ngay
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={handleAddOrRemoveFromCart}
          disabled={variant.stock === 0}
          variant="outline"
          className={`flex-1 border transition ${
            isProductInCart
              ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {isProductInCart ? "Xóa khỏi giỏ hàng" : "Thêm vào giỏ hàng"}
        </Button>

        <Button
          onClick={handleAddOrRemoveFromWishlist}
          variant="outline"
          className={`px-4 border transition ${
            isProductInWishlist
              ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition ${
              isProductInWishlist ? "fill-red-500" : "text-gray-400"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
