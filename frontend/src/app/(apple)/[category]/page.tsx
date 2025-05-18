"use client";
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Menu, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { useGetProductByCategory } from "@/hooks/useProducts";
import { useSubCategory } from "@/hooks/useCategories";
import BreadCrumb from "./components/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import { ProductFilters } from "./components/product-filter";
import ProductCard from "./components/product-card";
import { ProductVariant } from "@/types/product";
import { APPLE_CATEGORIES } from "@/constants/categories";
import SubCategoryFilter from "./components/sub-category-filter";
import ProductNotFound from "@/components/common/product-not-found";
import { Product } from "@/types/product";

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>(
    []
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const { ref, inView } = useInView();

  const foundCategory = APPLE_CATEGORIES.find(
    (c) => c.name.toLowerCase() === params.category.toLowerCase()
  );
  const categoryId = foundCategory?.id;

  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useSubCategory(categoryId as string);
  const subCategories = subCategoriesData?.data || [];

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProductByCategory(selectedSubCategory || (categoryId as string));

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    setFilteredVariants([]);
  }, [selectedSubCategory]);

  const allProducts = products?.pages[0]?.data || [];
  const allVariants = allProducts.flatMap(
    (product: Product) => product.variants
  );
  const paginatedVariants =
    products?.pages.flatMap((page, pageIndex) => {
      const startIndex = pageIndex * 10;
      const endIndex = startIndex + 10;
      return allVariants.slice(startIndex, endIndex);
    }) || [];

  const colors = Array.from(
    new Set(
      allProducts.flatMap((p: Product) =>
        p.variants.map((v: ProductVariant) => v.color.colorName)
      )
    )
  ) as string[];

  const storageOptions = Array.from(
    new Set(
      allProducts.flatMap((p: Product) =>
        p.variants.map((v: ProductVariant) => v.storage)
      )
    )
  ) as string[];

  const priceRange = {
    min: Math.min(
      ...allProducts.flatMap((p: Product) =>
        p.variants.map((v: ProductVariant) => v.price)
      )
    ),
    max: Math.max(
      ...allProducts.flatMap((p: Product) =>
        p.variants.map((v: ProductVariant) => v.price)
      )
    ),
  };

  const handleFilterChange = (filters: {
    colors: string[];
    storage: string[];
    priceRange: [number, number];
  }) => {
    const filtered = allProducts.flatMap((product: Product) =>
      product.variants.filter((variant: ProductVariant) => {
        if (
          filters.colors.length > 0 &&
          !filters.colors.includes(variant.color.colorName)
        ) {
          return false;
        }
        if (
          filters.storage.length > 0 &&
          !filters.storage.includes(variant.storage)
        ) {
          return false;
        }
        if (
          variant.price < filters.priceRange[0] ||
          variant.price > filters.priceRange[1]
        ) {
          return false;
        }
        return true;
      })
    );

    setFilteredVariants(filtered);
    setIsMobileFilterOpen(false);
  };

  const handleSubCategoryChange = (subCategoryId: string | null) => {
    setSelectedSubCategory(subCategoryId);
    setFilteredVariants([]);
  };

  if (isLoadingProducts || isLoadingSubCategories) {
    return <Loading />;
  }

  const displayVariants =
    filteredVariants.length > 0 ? filteredVariants : paginatedVariants;

  const hasNoProducts =
    !allProducts.length ||
    (productsError as AxiosError)?.response?.status === 404;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <BreadCrumb />
        <div className="mb-6">
          <SubCategoryFilter
            subCategories={subCategories}
            selectedSubCategory={selectedSubCategory}
            onSelectSubCategory={handleSubCategoryChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {!hasNoProducts && (
            <>
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <ProductFilters
                    colors={colors}
                    storageOptions={storageOptions}
                    priceRange={priceRange}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="lg:hidden mb-4">
                <Sheet
                  open={isMobileFilterOpen}
                  onOpenChange={setIsMobileFilterOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                    >
                      <Menu className="mr-2 h-4 w-4" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-full sm:w-[340px] bg-white"
                  >
                    <ProductFilters
                      colors={colors}
                      storageOptions={storageOptions}
                      priceRange={priceRange}
                      onFilterChange={handleFilterChange}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}

          <div className="flex-1">
            {hasNoProducts ? (
              <ProductNotFound />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayVariants.map((variant: ProductVariant) => (
                    <ProductCard
                      key={variant._id}
                      variant={variant}
                      productName={
                        allProducts.find(
                          (p: Product) => p._id === variant.product
                        )?.name || ""
                      }
                    />
                  ))}
                </div>
                <div
                  ref={ref}
                  className="h-20 flex items-center justify-center"
                >
                  {isFetchingNextPage && (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-500">
                        Đang tải thêm sản phẩm...
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
