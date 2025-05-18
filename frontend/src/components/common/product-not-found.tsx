import React from "react";
import Image from "next/image";

function ProductOutOfStock() {
  return (
    <div className=" bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            alt="Điện thoại đã tạm hết hàng"
            src="/assets/images/product-not-found.png"
            fill
            sizes="256px"
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Điện thoại này đã tạm hết hàng 😢
        </h1>
        <p className="text-gray-500">
          Bạn vui lòng quay lại sau hoặc tham khảo sản phẩm khác nhé! 🙏
        </p>
      </div>
    </div>
  );
}

export default ProductOutOfStock;
