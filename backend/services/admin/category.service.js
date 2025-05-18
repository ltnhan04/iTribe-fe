const Category = require("../../models/category.model");
const AppError = require("../../helpers/appError.helper");

class CategoryService {
  static handleGetCategories = async () => {
    const categories = await Category.find({}).populate({
      path: "parent_category",
      select: "name",
    });
    return categories;
  };
  static handleGetSubcategories = async (parentCategoryId) => {
    const subcategories = await Category.find({
      parent_category: parentCategoryId,
    }).populate({
      path: "parent_category",
      select: "name",
    });

    if (!subcategories.length) {
      throw new AppError("No subcategories found", 404);
    }

    return subcategories;
  };

  static handleGetCategoryById = async (id) => {
    const category = await Category.findById(id).populate({
      path: "parent_category",
      select: "name",
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  };

  static handleCreateCategory = async (name, parentCategoryId = null) => {
    if (parentCategoryId) {
      const parentCategory = await Category.findById(parentCategoryId);
      if (!parentCategory) {
        throw new AppError("Parent category not found", 404);
      }
    }

    const category = new Category({
      name,
      parent_category: parentCategoryId,
    });

    const savedCategory = await category.save();
    if (!savedCategory) {
      throw new AppError("Failed to create category", 400);
    }

    return savedCategory;
  };

  static handleUpdateCategory = async (id, updates) => {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (updates.parent_category) {
      const parentCategory = await Category.findById(updates.parent_category);
      if (!parentCategory) {
        throw new AppError("Parent category not found", 404);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    ).populate({
      path: "parent_category",
      select: "name",
    });

    return updatedCategory;
  };

  static handleDeleteCategory = async (id) => {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const hasChildren = await Category.exists({ parent_category: id });
    if (hasChildren) {
      throw new AppError("Cannot delete category with subcategories", 400);
    }

    await Category.findByIdAndDelete(id);
    return { message: "Category deleted successfully" };
  };
}

module.exports = CategoryService;
