const ProductService = require("../../services/customer/product.service");

const getVariantBySlug = async (req, res, next) => {
  try {
    const { slug } = req.body;
    const variants = await ProductService.handleGetVariantsBySlug(slug);
    res.status(200).json({ message: "success", data: variants });
  } catch (error) {
    next(error);
  }
};
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const variants = await ProductService.handleGetProductByCategory(
      categoryId.replace(/"/g, "")
    );
    res.status(200).json({
      message: "Get products by category successfully",
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};
const getAllProductsUser = async (_, res, next) => {
  try {
    const data = await ProductService.handleGetProducts();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.handleGetProductById(id);
    res.status(200).json({ product });
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
};

const getProductByName = async (req, res, next) => {
  let { name } = req.params;
  name = name.trim();

  try {
    const data = await ProductService.handleGetProductByName(name);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  const { query } = req.query;
  try {
    const products = await ProductService.handleSearchProducts(query);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getProductByPriceRange = async (req, res, next) => {
  const { min, max } = req.query;

  try {
    const products = await ProductService.handleGetProductByRange(
      Number(min),
      Number(max)
    );
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getPaginatedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const products = await ProductService.handlePaginatedProducts(page, limit);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
};

module.exports = {
  getAllProductsUser,
  getProductById,
  getProductByName,
  searchProducts,
  getProductByPriceRange,
  getPaginatedProducts,
  getProductsByCategory,
  getVariantBySlug,
};
