"use client";
import React, { useState } from "react";
import { useGetProductByCategory } from "@/hooks/useProducts";
import { useSubCategory } from "@/hooks/useCategories";
import BreadCrumb from "./components/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Loading from "@/app/loading";
import { ProductFilters } from "./components/product-filter";
import ProductCard from "./components/product-card";
import { Variant } from "@/services/products/types";
import { APPLE_CATEGORIES } from "@/constants/categories";
import SubCategoryFilter from "./components/sub-category-filter";
import { AxiosError } from "axios";

interface Product {
  _id: string;
  name: string;
  variants: Variant[];
}

const AppleWatch = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredVariants, setFilteredVariants] = useState<Variant[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const watchCategory = APPLE_CATEGORIES.find(
    (category) => category.name.toLowerCase() === "apple watch"
  );
  const watchId = watchCategory?.id;

  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useSubCategory(watchId as string);
  const subCategories = subCategoriesData?.data || [];

  const { data: products, isLoading: isLoadingProducts, error: productsError } =
    useGetProductByCategory(selectedSubCategory || (watchId as string));

  // Reset filtered variants khi chuyển subcategory
  React.useEffect(() => {
    setFilteredVariants([]);
  }, [selectedSubCategory]);

  const colors = Array.from(
    new Set(
      products?.data?.flatMap((p: Product) =>
        p.variants.map((v: Variant) => v.color.colorName)
      ) || []
    )
  ) as string[];

  const storageOptions = Array.from(
    new Set(
      products?.data?.flatMap((p: Product) =>
        p.variants.map((v: Variant) => v.storage)
      ) || []
    )
  ) as string[];

  const priceRange = {
    min: Math.min(
      ...(products?.data?.flatMap((p: Product) =>
        p.variants.map((v: Variant) => v.price)
      ) || [0])
    ),
    max: Math.max(
      ...(products?.data?.flatMap((p: Product) =>
        p.variants.map((v: Variant) => v.price)
      ) || [0])
    ),
  };

  const handleFilterChange = (filters: {
    colors: string[];
    storage: string[];
    priceRange: [number, number];
  }) => {
    const filtered =
      products?.data?.flatMap((product: Product) =>
        product.variants.filter((variant: Variant) => {
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
      ) || [];

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

  const allVariants =
    products?.data?.flatMap((product: Product) => product.variants) || [];
  const displayVariants =
    filteredVariants.length > 0 ? filteredVariants : allVariants;

  const hasNoProducts = !products?.data || products.data.length === 0 || (productsError as AxiosError)?.response?.status === 404;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
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
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500">
                  Vui lòng thử lại với danh mục khác
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayVariants.map((variant: Variant) => (
                  <ProductCard
                    key={variant._id}
                    variant={variant}
                    productName={
                      products?.data?.find(
                        (p: Product) => p._id === variant.product
                      )?.name || ""
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleWatch;
