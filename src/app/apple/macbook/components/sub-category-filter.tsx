"use client";
import { Button } from "@/components/ui/button";

interface SubCategory {
    _id: string;
    name: string;
    parent_category: {
      _id: string;
      name: string;
    };
  }

interface SubCategoryFilterProps {
  subCategories: SubCategory[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (subCategoryId: string | null) => void;
}

export default function SubCategoryFilter({
  subCategories,
  selectedSubCategory,
  onSelectSubCategory,
}: SubCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedSubCategory === null ? "default" : "outline"}
        onClick={() => onSelectSubCategory(null)}
        className="text-sm"
      >
        Tất cả
      </Button>
      {subCategories.map((subCategory) => (
        <Button
          key={subCategory._id}
          variant={
            selectedSubCategory === subCategory._id ? "default" : "outline"
          }
          onClick={() => onSelectSubCategory(subCategory._id)}
          className="text-sm"
        >
          {subCategory.name}
        </Button>
      ))}
    </div>
  );
} 