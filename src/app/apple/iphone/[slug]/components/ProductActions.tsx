import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { ProductResponse } from "../types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, removeToCart } from "@/lib/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlists/wistlistSlice";
import { useToast } from "@/hooks/use-toast";
import { CartType } from "@/lib/features/cart/cartType";
import type { WishlistType } from "@/lib/features/wishlists/wishlistsType";

interface ProductActionsProps {
  variant: ProductResponse;
}

export default function ProductActions({ variant }: ProductActionsProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const cart = useAppSelector((state) => state.cart);
  const wishlist = useAppSelector((state) => state.wishlist);

  const isProductInCart = variant
    ? cart.cart.some((item: CartType) => item.id === variant._id)
    : false;

  const isProductInWishlist = variant
    ? wishlist.wishlists.some(
        (item: WishlistType) => item.id === variant._id
      )
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
    // TODO: Chuyển hướng đến trang thanh toán
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
        className="w-full bg-black hover:bg-gray-900 text-white rounded-lg py-3 text-sm font-medium"
      >
        Buy Now
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={handleAddOrRemoveFromCart}
          disabled={variant.stock === 0}
          variant="outline"
          className="flex-1 border-gray-300 hover:bg-gray-50"
        >
          {isProductInCart ? "Remove from Cart" : "Add to Cart"}
        </Button>

        <Button
          onClick={handleAddOrRemoveFromWishlist}
          variant="outline"
          className={`px-4 border ${
            isProductInWishlist
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-gray-300"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isProductInWishlist ? "fill-red-500" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
} 