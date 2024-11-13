"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, User, ShoppingCart, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, removeToCart } from "@/lib/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlists/wistlistSlice";
import type { CartType } from "@/lib/features/cart/cartType";
import type { WishlistType } from "@/lib/features/wishlists/wishlistsType";

import { getProductDetails } from "@/api/services/products/productsApi";
import type { Product, Variant } from "@/app/(products)/iphone/type";

interface SlugProps {
  params: { slug: string[] };
}

const ProductDetail: React.FC<SlugProps> = ({ params }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const wishlist = useAppSelector((state) => state.wishlist.wishlists);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductDetails(params.slug[0]);
        const productData = response.data.product;
        setProduct(productData);
        if (productData.variants.length > 0) {
          const initialVariant = productData.variants[0];
          setSelectedVariant(initialVariant);
          setSelectedImage(initialVariant.images[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [params.slug]);

  const averageRating = selectedVariant
    ? selectedVariant.reviews.reduce((acc, review) => acc + review.rating, 0) /
      selectedVariant.reviews.length
    : 0;

  const handleThumbnailClick = (image: string) => setSelectedImage(image);

  const handleVariantChange = (variantId: string) => {
    const newVariant = product?.variants.find(
      (variant) => variant._id === variantId
    );
    if (newVariant) {
      setSelectedVariant(newVariant);
      setSelectedImage(newVariant.images[0]);
    }
  };

  const isProductInCart = selectedVariant
    ? cart.some((item: CartType) => item.id === selectedVariant._id)
    : false;

  const isProductInWishlist = selectedVariant
    ? wishlist.some((item: WishlistType) => item.id === selectedVariant._id)
    : false;

  const handleAddOrRemoveFromCart = () => {
    if (selectedVariant) {
      if (isProductInCart) {
        dispatch(removeToCart(selectedVariant._id));
      } else {
        dispatch(
          addToCart({
            id: selectedVariant._id,
            name: selectedVariant.name,
            price: selectedVariant.price,
            image: selectedVariant.images[0],
            quantity: 1,
          })
        );
      }
    }
  };

  const handleAddOrRemoveFromWishlist = () => {
    if (selectedVariant) {
      if (isProductInWishlist) {
        dispatch(removeFromWishlist(selectedVariant._id));
      } else {
        dispatch(
          addToWishlist({
            id: selectedVariant._id,
            name: selectedVariant.name,
            price: selectedVariant.price,
            image: selectedVariant.images[0],
            quantity: 1,
          })
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8">
      {selectedVariant && (
        <div className="flex flex-col items-center space-y-4">
          <Carousel className="w-full max-w-[500px] relative">
            <CarouselContent
              style={{
                transform: `translateX(-${
                  selectedVariant.images.indexOf(selectedImage || "") * 100
                }%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {selectedVariant.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[300px] md:h-[500px]">
                    <Image
                      src={image}
                      fill
                      quality={100}
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      alt="Product image"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselNext
              onClick={() =>
                setSelectedImage(
                  selectedVariant.images[
                    (selectedVariant.images.indexOf(selectedImage || "") + 1) %
                      selectedVariant.images.length
                  ]
                )
              }
              className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-1/2 transform -translate-y-1/2 right-3"
            />
            <CarouselPrevious
              disabled={false}
              onClick={() =>
                setSelectedImage(
                  selectedVariant.images[
                    (selectedVariant.images.indexOf(selectedImage || "") -
                      1 +
                      selectedVariant.images.length) %
                      selectedVariant.images.length
                  ]
                )
              }
              className="border-gray-200 h-6 w-6 sm:h-8 sm:w-8 border absolute top-1/2 transform -translate-y-1/2 left-3"
            />
          </Carousel>
          <div className="flex items-center justify-center flex-wrap gap-4">
            {selectedVariant.images.map((image, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(image)}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 ${
                  image === selectedImage ? "border-2 border-blue" : ""
                } rounded-md cursor-pointer transition-opacity duration-300 hover:opacity-80`}
              >
                <Image
                  src={image}
                  fill
                  quality={100}
                  sizes="48px"
                  alt="Thumbnail image"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {product && selectedVariant && (
        <div className="space-y-6">
          <h1 className="font-bold text-3xl">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <Tabs
            defaultValue={selectedVariant._id}
            onValueChange={handleVariantChange}
          >
            <TabsList>
              {product.variants.map((variant) => (
                <TabsTrigger key={variant._id} value={variant._id}>
                  {variant.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {product.variants.map((variant) => (
              <TabsContent key={variant._id} value={variant._id}>
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold">
                        {variant.price.toLocaleString()} VND
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {variant.stock}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Color: </span>
                      <span
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: variant.color.colorCode }}
                        title={variant.color.colorName}
                      ></span>
                    </div>
                    <div>Storage: {variant.storage} GB</div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex space-x-2">
            <Button onClick={handleAddOrRemoveFromCart} className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isProductInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
            <Button
              onClick={handleAddOrRemoveFromWishlist}
              variant={isProductInWishlist ? "destructive" : "outline"}
              className="px-3"
            >
              <Heart className="w-4 h-4" />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
          </div>
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="flex items-center mb-4">
          <span className="text-3xl font-bold mr-2">
            {isNaN(Number(averageRating.toFixed(1)))
              ? 0
              : averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({selectedVariant?.reviews.length} reviews)
          </span>
        </div>
        <div className="space-x-4 flex items-center">
          {selectedVariant?.reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.user.name}`}
                      alt={review.user.name}
                    />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between space-x-2">
                        <h3 className="text-sm font-bold">
                          {review.user.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
