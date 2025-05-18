const { deleteImage } = require("../../helpers/cloudinary.helper");
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
    const products = await Product.find({})
      .populate({
        path: "variants",
        select: "color storage price stock_quantity images rating",
      })
      .populate({
        path: "category",
        select: "name",
      });

    if (!products.length) {
      throw new AppError("No products found", 404);
    }

    return products.map((product) => {
      const firstVariant = product.variants[0];
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category
          ? {
              _id: product.category._id,
              name: product.category.name,
              description: product.category.description,
            }
          : null,
        price: firstVariant ? firstVariant.price : 0,
        stock: firstVariant ? firstVariant.stock_quantity : 0,
        rating: firstVariant ? firstVariant.rating : 0,
        image: firstVariant?.images[0] || null,
      };
    });
  };

  static handleGetProductDetails = async (id) => {
    const product = await Product.findById(id)
      .populate({
        path: "variants",
        populate: {
          path: "reviews",
          populate: {
            path: "user",
            select: "name email",
          },
        },
      })
      .populate({
        path: "category",
        select: "name",
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

  static handleCreateProduct = async (description, name, category) => {
    const product = new Product({
      description,
      name,
      category,
    });

    const savedProduct = await product.save();
    if (!savedProduct) {
      throw new AppError("Failed to create product", 400);
    }
    return savedProduct;
  };

  static handleUpdateProduct = async (id, updates) => {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (updates.image && product.image) {
      await deleteImage(product.image);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );
    return updatedProduct;
  };

  static handleDeleteProduct = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    await ProductVariant.deleteMany({ product: id });
    if (product.image) {
      await deleteImage(product.image);
    }
    await Product.findByIdAndDelete(id);
    return { message: "Product and its variants deleted successfully" };
  };
}

module.exports = ProductService;
