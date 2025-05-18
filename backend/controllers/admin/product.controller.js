const ProductService = require("../../services/admin/product.service");

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const products = await ProductService.handleGetProductByCategory(
      categoryId.replace(/"/g, "")
    );
    res.status(200).json({
      message: "Get Products Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
const getAllProductsAdmin = async (_, res, next) => {
  try {
    const products = await ProductService.handleGetProducts();
    res.status(200).json({
      message: "Get Products Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductDetailsAdmin = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await ProductService.handleGetProductDetails(id);
    res.status(200).json({
      message: "Get Product Info Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const { description, name, category } = req.body;

  try {
    const savedProduct = await ProductService.handleCreateProduct(
      description,
      name,
      category
    );
    res.status(201).json({
      message: "Product created successfully!",
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductService.handleUpdateProduct(
      id,
      req.body
    );
    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await ProductService.handleDeleteProduct(id);
    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductsAdmin,
  getProductsByCategory,
  getProductDetailsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
