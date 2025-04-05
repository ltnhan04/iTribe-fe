import { productImages } from "./images";

// Categories
export const categories = [
  {
    id: 1,
    category_name: "Apple",
    parent_category_id: null,
  },
  {
    id: 2,
    category_name: "iPhone",
    parent_category_id: 1,
  },
  {
    id: 3,
    category_name: "iPad",
    parent_category_id: 1,
  },
  {
    id: 4,
    category_name: "MacBook",
    parent_category_id: 1,
  },
  {
    id: 5,
    category_name: "Apple Watch",
    parent_category_id: 1,
  },
  {
    id: 6,
    category_name: "AirPods",
    parent_category_id: 1,
  },
];

// Products
export const products = [
  {
    id: 1,
    category_id: 2, // iPhone
    product_name: "iPhone 15 Pro Max",
    description: "iPhone mạnh mẽ nhất từ trước đến nay với chip A17 Pro",
  },
  {
    id: 2,
    category_id: 2,
    product_name: "iPhone 15 Pro",
    description: "Nâng cấp camera chuyên nghiệp với độ phân giải 48MP",
  },
  {
    id: 3,
    category_id: 3, // iPad
    product_name: "iPad Pro M2",
    description: "iPad mạnh mẽ nhất với chip M2 và màn hình Liquid Retina XDR",
  },
  {
    id: 4,
    category_id: 3,
    product_name: "iPad Air",
    description: "Mỏng nhẹ, mạnh mẽ với chip M1",
  },
  {
    id: 5,
    category_id: 4, // MacBook
    product_name: "MacBook Pro 14",
    description: "Hiệu năng đột phá với chip M3 Pro và M3 Max",
  },
  {
    id: 6,
    category_id: 4,
    product_name: "MacBook Air 15",
    description: "Màn hình lớn nhất từng có trên MacBook Air",
  },
  {
    id: 7,
    category_id: 5, // Apple Watch
    product_name: "Apple Watch Series 9",
    description: "Chip S9 mới, màn hình sáng 2000 nits",
  },
  {
    id: 8,
    category_id: 5,
    product_name: "Apple Watch Ultra 2",
    description: "Bền bỉ với khung titan, pin 36 giờ",
  },
  {
    id: 9,
    category_id: 6, // AirPods
    product_name: "AirPods Pro 2",
    description: "Chống ồn chủ động thế hệ mới, âm thanh không gian",
  },
  {
    id: 10,
    category_id: 6,
    product_name: "AirPods Max",
    description: "Tai nghe over-ear cao cấp với chất âm studio",
  },
];

// Product Variants
export const productVariants = [
  // iPhone 15 Pro Max Variants
  {
    id: 1,
    product_id: 1,
    storage: "256GB",
    price: 34990000,
    stock_quantity: 50,
    slug: "iphone-15-pro-max-256gb",
    rating: 4.9,
    color: {
      name: "Natural Titanium",
      code: "#9A9B9F"
    },
    status: "in stock",
    images: productImages["iphone-15-pro-max"].titanium
  },
  {
    id: 2,
    product_id: 1,
    storage: "512GB",
    price: 41990000,
    stock_quantity: 30,
    slug: "iphone-15-pro-max-512gb",
    rating: 4.8,
    color: {
      name: "Blue Titanium",
      code: "#515A6B"
    },
    status: "in stock",
    images: productImages["iphone-15-pro-max"].blue
  },

  // MacBook Pro 14 Variants
  {
    id: 3,
    product_id: 5,
    storage: "512GB",
    price: 49990000,
    stock_quantity: 20,
    slug: "macbook-pro-14-m3-pro-512gb",
    rating: 4.9,
    color: {
      name: "Space Black",
      code: "#1C1C1C"
    },
    status: "in stock",
    images: productImages["macbook-pro-14"].black
  },
  {
    id: 4,
    product_id: 5,
    storage: "1TB",
    price: 59990000,
    stock_quantity: 0,
    slug: "macbook-pro-14-m3-max-1tb",
    rating: 5.0,
    color: {
      name: "Silver",
      code: "#E3E3E3"
    },
    status: "out of stock",
    images: productImages["macbook-pro-14"].silver
  },

  // iPad Pro M2 Variants
  {
    id: 5,
    product_id: 3,
    storage: "256GB",
    price: 27990000,
    stock_quantity: 40,
    slug: "ipad-pro-m2-11-256gb-wifi",
    rating: 4.7,
    color: {
      name: "Space Gray",
      code: "#2C2C2C"
    },
    status: "in stock",
    images: productImages["ipad-pro-m2"].gray
  },

  // Apple Watch Ultra 2 Variants
  {
    id: 6,
    product_id: 8,
    storage: "32GB",
    price: 21990000,
    stock_quantity: 25,
    slug: "apple-watch-ultra-2",
    rating: 4.8,
    color: {
      name: "Titanium",
      code: "#ABABAB"
    },
    status: "in stock",
    images: productImages["watch-ultra-2"].titanium
  },

  // AirPods Pro 2 Variants
  {
    id: 7,
    product_id: 9,
    storage: "N/A",
    price: 6990000,
    stock_quantity: 100,
    slug: "airpods-pro-2",
    rating: 4.9,
    color: {
      name: "White",
      code: "#FFFFFF"
    },
    status: "in stock",
    images: productImages["airpods-pro-2"].white
  },
]; 