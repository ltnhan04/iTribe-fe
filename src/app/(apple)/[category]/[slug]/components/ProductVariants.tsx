import { ProductResponse } from "@/types/slug";

interface ProductVariantsProps {
  variants: ProductResponse[];
  selectedVariant: ProductResponse;
  onVariantSelect: (colorName: string, storage: string) => void;
}

export default function ProductVariants({
  variants,
  selectedVariant,
  onVariantSelect,
}: ProductVariantsProps) {
  const uniqueColors = Array.from(
    new Set(variants.map((v) => v.color.colorName))
  );
  const uniqueStorages = Array.from(new Set(variants.map((v) => v.storage)));
  const colorStorageMap = variants.reduce((acc, variant) => {
    if (!acc[variant.color.colorName]) {
      acc[variant.color.colorName] = [];
    }
    acc[variant.color.colorName].push(variant.storage);
    return acc;
  }, {} as Record<string, string[]>);
  const storageColorMap = variants.reduce((acc, variant) => {
    if (!acc[variant.storage]) {
      acc[variant.storage] = [];
    }
    acc[variant.storage].push(variant.color.colorName);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Màu</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((colorName) => {
            const variant = variants.find(
              (v) => v.color.colorName === colorName
            );
            if (!variant) return null;

            const isAvailable = colorStorageMap[colorName].includes(
              selectedVariant.storage
            );

            return (
              <button
                key={colorName}
                onClick={() =>
                  onVariantSelect(colorName, selectedVariant.storage)
                }
                disabled={!isAvailable}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  selectedVariant.color.colorName === colorName
                    ? "border-blue-600 bg-blue-50"
                    : isAvailable
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 opacity-50 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border border-gray-200 ${
                    !isAvailable ? "opacity-50" : ""
                  }`}
                  style={{ backgroundColor: variant.color.colorCode }}
                />
                <span
                  className={`text-sm ${
                    selectedVariant.color.colorName === colorName
                      ? "text-blue-600"
                      : isAvailable
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {colorName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Dung lượng</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueStorages.map((storage) => {
            const isAvailable = storageColorMap[storage].includes(
              selectedVariant.color.colorName
            );

            const variant = variants.find(
              (v) =>
                v.storage === storage &&
                v.color.colorName === selectedVariant.color.colorName
            );

            return (
              <button
                key={storage}
                onClick={() =>
                  onVariantSelect(selectedVariant.color.colorName, storage)
                }
                disabled={!isAvailable}
                className={`px-4 py-2 rounded-lg border ${
                  selectedVariant.storage === storage
                    ? "border-blue-600 bg-blue-50"
                    : isAvailable
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`font-medium ${
                      selectedVariant.storage === storage
                        ? "text-blue-600"
                        : isAvailable
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {storage}
                  </span>
                  {variant && isAvailable && (
                    <span className="text-sm text-gray-500">
                      {variant.price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
