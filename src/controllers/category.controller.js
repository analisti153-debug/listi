const categoryService = require("../services/category.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createCategory = catchAsync(async (req, res, next) => {
  const { name, description, archived } = req.body;

  if (!name) {
    return next(new AppError("Category name is required", 400));
  }

  const userId = req.user._id || req.user.id;

  const category = await categoryService.createCategory({
    name,
    description,
    archived,
    userId,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await categoryService.getCategoryById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name, description, archived } = req.body;

  const userId = req.user._id || req.user.id;

  const category = await categoryService.updateCategory(req.params.id, {
    name,
    description,
    archived,
    userId,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.deleteCategory(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};