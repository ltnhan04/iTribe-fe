"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

export function ProductFilters({
  colors,
  storageOptions,
  priceRange,
  onFilterChange,
}: ProductFiltersProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
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
      priceRange: currentPriceRange,
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
      priceRange: currentPriceRange,
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setCurrentPriceRange(newRange);
    onFilterChange({
      colors: selectedColors,
      storage: selectedStorage,
      priceRange: newRange,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Bộ lọc</h3>
      </div>

      {/* Màu sắc */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-gray-900">Màu sắc</h4>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorChange(color)}
              />
              <Label
                htmlFor={`color-${color}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dung lượng */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-gray-900">Dung lượng</h4>
        <div className="space-y-2">
          {storageOptions.map((storage) => (
            <div key={storage} className="flex items-center space-x-2">
              <Checkbox
                id={`storage-${storage}`}
                checked={selectedStorage.includes(storage)}
                onCheckedChange={() => handleStorageChange(storage)}
              />
              <Label
                htmlFor={`storage-${storage}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {storage}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-gray-900">Khoảng giá</h4>
        <Slider
          min={priceRange.min}
          max={priceRange.max}
          step={100000}
          value={currentPriceRange}
          onValueChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{currentPriceRange[0].toLocaleString("vi-VN")}đ</span>
          <span>{currentPriceRange[1].toLocaleString("vi-VN")}đ</span>
        </div>
      </div>
    </div>
  );
} 