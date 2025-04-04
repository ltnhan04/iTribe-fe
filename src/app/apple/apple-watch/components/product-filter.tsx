import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";

interface ProductFiltersProps {
  colors: string[];
  storageOptions: string[];
  priceRange: {
    min: number;
    max: number;
  };
  onFilterChange: (filters: {
    colors: string[];
    storage: string[];
    priceRange: [number, number];
  }) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  colors,
  storageOptions,
  priceRange,
  onFilterChange,
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);

  const handleColorChange = (color: string) => {
    const updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updatedColors);
    onFilterChange({
      colors: updatedColors,
      storage: selectedStorage,
      priceRange: selectedPriceRange,
    });
  };

  const handleStorageChange = (storage: string) => {
    const updatedStorage = selectedStorage.includes(storage)
      ? selectedStorage.filter((s) => s !== storage)
      : [...selectedStorage, storage];
    setSelectedStorage(updatedStorage);
    onFilterChange({
      colors: selectedColors,
      storage: updatedStorage,
      priceRange: selectedPriceRange,
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newPriceRange: [number, number] = [value[0], value[1]];
    setSelectedPriceRange(newPriceRange);
    onFilterChange({
      colors: selectedColors,
      storage: selectedStorage,
      priceRange: newPriceRange,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
        <div className="space-y-4">
          {colors.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Màu sắc</h4>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => handleColorChange(color)}
                    />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {storageOptions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Dung lượng</h4>
              <div className="space-y-2">
                {storageOptions.map((storage) => (
                  <div key={storage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`storage-${storage}`}
                      checked={selectedStorage.includes(storage)}
                      onCheckedChange={() => handleStorageChange(storage)}
                    />
                    <Label htmlFor={`storage-${storage}`}>{storage}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-4">Giá</h4>
            <div className="px-2">
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={100000}
                value={selectedPriceRange}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatPrice(selectedPriceRange[0])}</span>
                <span>{formatPrice(selectedPriceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 