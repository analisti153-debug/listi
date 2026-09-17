const Category = require("../models/category.model");

async function createCategory(data) {
  return await Category.create({
    name: data.name,
    description: data.description,
  });
}

async function getAllCategories() {
  return await Category.find().sort({ name: 1 });
}

async function getCategoryById(id) {
  return await Category.findById(id);
}

async function updateCategory(id, data) {
  return await Category.findByIdAndUpdate(
    id,
    {
      name: data.name,
      description: data.description,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

async function deleteCategory(id) {
  return await Category.findByIdAndDelete(id);
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};