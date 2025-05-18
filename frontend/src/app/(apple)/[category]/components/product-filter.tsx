"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFiltersProps {
  colors: string[];
  storageOptions: string[];
  priceRange: { min: number; max: number };
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
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([priceRange.min, priceRange.max]);

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    }
  };

  const handleStorageChange = (storage: string, checked: boolean) => {
    if (checked) {
      setSelectedStorage([...selectedStorage, storage]);
    } else {
      setSelectedStorage(selectedStorage.filter((s) => s !== storage));
    }
  };

  const handlePriceChange = (value: number[]) => {
    setSelectedPriceRange([value[0], value[1]]);
  };

  const applyFilters = () => {
    onFilterChange({
      colors: selectedColors,
      storage: selectedStorage,
      priceRange: selectedPriceRange,
    });
  };

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedStorage([]);
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    onFilterChange({
      colors: [],
      storage: [],
      priceRange: [priceRange.min, priceRange.max],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          Đặt lại
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["colors", "storage", "price"]} className="space-y-4">
        <AccordionItem value="colors" className="border-b border-gray-200">
          <AccordionTrigger className="text-gray-700 hover:text-gray-900 hover:no-underline">
            Màu sắc
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={(checked) =>
                      handleColorChange(color, checked as boolean)
                    }
                    className="border-gray-300 text-blue-600"
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className="text-sm font-medium leading-none text-gray-700 hover:text-gray-900"
                  >
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="storage" className="border-b border-gray-200">
          <AccordionTrigger className="text-gray-700 hover:text-gray-900 hover:no-underline">
            Dung lượng
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {storageOptions.map((storage) => (
                <div key={storage} className="flex items-center space-x-2">
                  <Checkbox
                    id={`storage-${storage}`}
                    checked={selectedStorage.includes(storage)}
                    onCheckedChange={(checked) =>
                      handleStorageChange(storage, checked as boolean)
                    }
                    className="border-gray-300 text-blue-600"
                  />
                  <label
                    htmlFor={`storage-${storage}`}
                    className="text-sm font-medium leading-none text-gray-700 hover:text-gray-900"
                  >
                    {storage}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b border-gray-200">
          <AccordionTrigger className="text-gray-700 hover:text-gray-900 hover:no-underline">
            Khoảng giá
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              <Slider
                defaultValue={[priceRange.min, priceRange.max]}
                min={priceRange.min}
                max={priceRange.max}
                step={50000}
                value={[selectedPriceRange[0], selectedPriceRange[1]]}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{selectedPriceRange[0].toLocaleString('vi-VN')}đ</span>
                <span>{selectedPriceRange[1].toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full text-white"
        onClick={applyFilters}
      >
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}
