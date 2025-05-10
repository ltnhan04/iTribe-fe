import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SubCategory } from "@/types/category";

interface SubCategoryFilterProps {
  subCategories: SubCategory[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (id: string | null) => void;
}

const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({
  subCategories,
  selectedSubCategory,
  onSelectSubCategory,
}) => {
  useEffect(() => {
    if (!selectedSubCategory && subCategories.length > 0) {
      onSelectSubCategory(subCategories[0]._id);
    }
  }, [selectedSubCategory, subCategories, onSelectSubCategory]);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {subCategories.map((category) => (
        <Button
          key={category._id}
          variant={selectedSubCategory === category._id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectSubCategory(category._id)}
          className={cn(
            "rounded-full",
            selectedSubCategory === category._id && "bg-primary text-white"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default SubCategoryFilter;
