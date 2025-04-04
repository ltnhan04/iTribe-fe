import React from "react";
import { Button } from "@/components/ui/button";
import { SubCategory } from "@/services/categories/types";

interface SubCategoryFilterProps {
  subCategories: SubCategory[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (subCategoryId: string | null) => void;
}

const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({
  subCategories,
  selectedSubCategory,
  onSelectSubCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedSubCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectSubCategory(null)}
        className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
      >
        Tất cả
      </Button>
      {subCategories.map((subCategory) => (
        <Button
          key={subCategory._id}
          variant={selectedSubCategory === subCategory._id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectSubCategory(subCategory._id)}
          className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
        >
          {subCategory.name}
        </Button>
      ))}
    </div>
  );
};

export default SubCategoryFilter; 