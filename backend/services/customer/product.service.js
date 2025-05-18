const Product = require("../../models/product.model");
const ProductVariant = require("../../models/productVariant.model");
const AppError = require("../../helpers/appError.helper");

class ProductService {
  static handleGetProductByCategory = async (categoryId) => {
    const products = await Product.find({ category: categoryId })
      .populate("variants")
      .exec();
    if (!products.length) {
      throw new AppError("No products found", 404);
    }
    return products;
  };
  static handleGetProducts = async () => {
    const products = await Product.find({}).populate({
      path: "variants",
      select: "color storage price stock_quantity images rating",
    });

    const data = products.map((product) => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: firstVariant ? firstVariant.price : 0,
        colors: [...new Set(product.variants.map((v) => v.color.colorName))],
        storages: [...new Set(product.variants.map((v) => v.storage))],
        image: firstVariant?.images[0] || null,
        rating: firstVariant?.rating || 0,
        stock: firstVariant?.stock_quantity || 0,
      };
    });

    return data;
  };

  static handleGetProductById = async (id) => {
    const product = await Product.findById(id).populate({
      path: "variants",
      populate: {
        path: "reviews",
        populate: {
          path: "user",
          select: "name email",
        },
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    product.variants = product.variants.map((variant) => {
      if (variant.reviews && variant.reviews.length > 0) {
        const totalRating = variant.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        variant.rating = (totalRating / variant.reviews.length).toFixed(1);
      }
      return variant;
    });

    return product;
  };

  static handleGetProductByName = async (name) => {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    }).populate({
      path: "variants",
      select: "color storage price stock_quantity images rating",
    });

    if (products.length === 0) {
      throw new AppError("Product not found", 404);
    }

    return products.map((product) => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: firstVariant ? firstVariant.price : 0,
        colors: [...new Set(product.variants.map((v) => v.color.colorName))],
        storages: [...new Set(product.variants.map((v) => v.storage))],
        image: firstVariant?.images[0] || null,
        rating: firstVariant?.rating || 0,
        stock: firstVariant?.stock_quantity || 0,
      };
    });
  };

  static handleSearchProducts = async (query) => {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate({
      path: "variants",
      select: "color storage price stock_quantity images rating",
    });

    if (!products || products.length === 0) {
      throw new AppError("Products not found", 404);
    }

    return products.map((product) => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: firstVariant ? firstVariant.price : 0,
        colors: [...new Set(product.variants.map((v) => v.color.colorName))],
        storages: [...new Set(product.variants.map((v) => v.storage))],
        image: firstVariant?.images[0] || null,
        rating: firstVariant?.rating || 0,
        stock: firstVariant?.stock_quantity || 0,
      };
    });
  };

  static handleGetProductByRange = async (min, max) => {
    const variants = await ProductVariant.find({
      price: { $gte: min, $lte: max || Infinity },
    }).populate({
      path: "product",
      select: "name description category",
    });

    if (!variants || variants.length === 0) {
      throw new AppError("Products not found", 404);
    }

    return variants.map((variant) => ({
      _id: variant._id,
      productId: variant.product._id,
      name: variant.product.name,
      description: variant.product.description,
      category: variant.product.category,
      color: variant.color,
      storage: variant.storage,
      price: variant.price,
      stock: variant.stock_quantity,
      images: variant.images,
      rating: variant.rating,
      slug: variant.slug,
    }));
  };

  static handlePaginatedProducts = async (page, limit) => {
    const skip = (page - 1) * limit;
    const products = await Product.find()
      .populate({
        path: "variants",
        select: "color storage price stock_quantity images rating",
      })
      .skip(skip)
      .limit(parseInt(limit));

    return products.map((product) => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: firstVariant ? firstVariant.price : 0,
        colors: [...new Set(product.variants.map((v) => v.color.colorName))],
        storages: [...new Set(product.variants.map((v) => v.storage))],
        image: firstVariant?.images[0] || null,
        rating: firstVariant?.rating || 0,
        stock: firstVariant?.stock_quantity || 0,
      };
    });
  };
  static handleGetVariantsBySlug = async (slug) => {
    const variants = await ProductVariant.find({ slug })
      .populate({
        path: "product",
        select: "name description category",
      })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!variants || variants.length === 0) {
      throw new AppError("No variants found", 404);
    }

    return variants.map((variant) => {
      let rating = 0;
      if (variant.reviews && variant.reviews.length > 0) {
        const totalRating = variant.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        rating = (totalRating / variant.reviews.length).toFixed(1);
      }

      return {
        _id: variant._id,
        productId: variant.product._id,
        name: variant.product.name,
        description: variant.product.description,
        category: variant.product.category,
        color: variant.color,
        storage: variant.storage,
        price: variant.price,
        stock: variant.stock_quantity,
        images: variant.images,
        rating,
        reviews: variant.reviews,
        slug: variant.slug,
      };
    });
  };
}

module.exports = ProductService;
