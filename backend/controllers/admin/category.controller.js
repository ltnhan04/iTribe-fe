const CategoryService = require("../../services/admin/category.service");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.handleGetCategories();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};
const getSubcategories = async (req, res, next) => {
  try {
    const { parentCategoryId } = req.params;
    const subcategories = await CategoryService.handleGetSubcategories(
      parentCategoryId
    );
    res.status(200).json({ message: "success", data: subcategories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.handleGetCategoryById(id);
    res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, parent_category } = req.body;
    const category = await CategoryService.handleCreateCategory(
      name,
      parent_category
    );
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await CategoryService.handleUpdateCategory(id, updates);
    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.handleDeleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
};
