const Category = require("../models/category.model");

async function createCategory(data) {
  return await Category.create({
    name: data.name,
    description: data.description,
    updated_by: data.userId,
    archived: data.archived ?? false,
  });
}

async function getAllCategories() {
  return await Category.find().sort({ name: 1 });
}

async function getCategoryById(id) {
  return await Category.findById(id);
}

async function updateCategory(id, data) {
  const updateData = {
    name: data.name,
    description: data.description,
    updated_by: data.userId,
  };

  if (data.archived !== undefined) {
    updateData.archived = data.archived;
  }

  return await Category.findByIdAndUpdate(
    id,
    updateData,
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