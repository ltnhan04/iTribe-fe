import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ProductResponse } from "@/types/slug";
import { StarIcon } from "lucide-react";
import DOMPurify from "dompurify";

interface ProductInfoProps {
  variant: ProductResponse;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ variant }) => {
  const sanitizedDescription = DOMPurify.sanitize(variant.description || "");
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {variant.name} {variant.storage}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < (variant.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-100"
                } fill-current`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {variant.rating
              ? `(Đã có ${variant.reviews?.length} đánh giá)`
              : "(Chưa có đánh giá)"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(variant.price)}
          </span>
        </div>
        {variant.stock > 0 ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Còn hàng ({variant.stock})
          </Badge>
        ) : (
          <Badge variant="destructive">Hết hàng</Badge>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Màu sắc đã chọn
        </h3>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: variant.color.colorCode }}
          />
          <span className="text-gray-700">{variant.color.colorName}</span>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-500">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Thông tin sản phẩm
        </h3>
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
      </div>

      <div className="prose prose-sm max-w-none text-gray-500">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chính sách bán hàng
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Bảo hành chính hãng 12 tháng</li>
          <li>Hỗ trợ đổi mới trong 30 ngày</li>
          <li>Miễn phí giao hàng toàn quốc</li>
          <li>Trả góp 0% lãi suất</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
