export const data = [
  {
    _id: "6732c93813a5d5f5f4dbd235",
    price: 8990000,
    name: "iPhone 11",
    colors: [
      {
        colorName: "Trắng",
        colorCode: "#ffffff",
      },
    ],
    storages: ["64"],
    image:
      "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384247/products/bz7g3xcjoeu2wugxvqxj.jpg",
    status: "active",
  },
  {
    _id: "6732c94a13a5d5f5f4dbd238",
    price: 0,
    name: "iPhone 12",
    colors: [],
    storages: [],
    image: null,
    status: "active",
  },
  {
    _id: "6732c99d13a5d5f5f4dbd23b",
    price: 0,
    name: "iPhone 13",
    colors: [],
    storages: [],
    image: null,
    status: "active",
  },
  {
    _id: "6732c9af13a5d5f5f4dbd23e",
    price: 0,
    name: "iPhone 14",
    colors: [],
    storages: [],
    image: null,
    status: "active",
  },
  {
    _id: "6732ca5913a5d5f5f4dbd248",
    price: 0,
    name: "iPhone 15",
    colors: [],
    storages: [],
    image: null,
    status: "active",
  },
  {
    _id: "6732ca6f13a5d5f5f4dbd24b",
    price: 0,
    name: "iPhone 16",
    colors: [],
    storages: [],
    image: null,
    status: "active",
  },
];

export const product = {
  _id: "6732c93813a5d5f5f4dbd235",
  name: "iPhone 11",
  description:
    "The iPhone 11, launched in 2019, features a dual-camera system, excellent battery life, and a vibrant 6.1-inch Liquid Retina display. It introduced Night mode photography and offered a variety of colorful finishes, making it a great blend of performance and affordability.",
  variants: [
    {
      _id: "6732d2a7e7884dd43885d622",
      name: "iPhone 11 64GB",
      storage: "64",
      price: 8990000,
      stock: 10,
      slug: "iphone-11-64gb",
      images: [
        "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384247/products/bz7g3xcjoeu2wugxvqxj.jpg",
        "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384248/products/xvwpemvxhwpfhsnnt5ym.jpg",
        "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384249/products/vtpug5p3wy8gvyfexjr4.jpg",
        "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384250/products/g5cikkziidxj99bey8nw.jpg",
        "https://res.cloudinary.com/durjxrcdm/image/upload/v1731384250/products/dujobtdnhexwv3kmpehk.png",
      ],
      color: {
        colorName: "Trắng",
        colorCode: "#ffffff",
      },
      rating: 0,
      reviews: [
        {
          _id: "6732da02ea914808d2c0a926",
          productId: "6732d2a7e7884dd43885d622",
          user: {
            _id: "670bdd169c172cc7b82a45f6",
            name: "Luong tu nhan",
            email: "luongtunhan2004@gmail.com",
          },
          rating: 4,
          comment: "San Pham dep qua!",
          isAnonymous: false,
          createdAt: "2024-11-12T04:30:58.769Z",
          updatedAt: "2024-11-12T04:30:58.769Z",
        },
      ],
    },
  ],
  reviews: [],
};
