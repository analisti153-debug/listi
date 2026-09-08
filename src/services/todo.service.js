const mongoose = require("mongoose");
const Todo = require("../models/todo.model");

async function createTodo(data) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    owner: data.owner,
  });
  return await todo.save();
}

async function getAllTodos(ownerId, queryOptions = {}) {
  const page = Math.max(1, parseInt(queryOptions.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryOptions.limit, 10) || 10);
  const { completed, sortBy = "createdAt", order = "desc" } = queryOptions;

  // Konversi ownerId agar cocok baik berupa string maupun ObjectId
  const filterOwner = mongoose.Types.ObjectId.isValid(ownerId)
    ? new mongoose.Types.ObjectId(ownerId)
    : ownerId;

  const filter = { owner: filterOwner };

  if (completed !== undefined && completed !== "") {
    filter.completed = completed === "true";
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit),
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    todos,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
}

async function getAllTodosForAdmin(queryOptions = {}) {
  const page = Math.max(1, parseInt(queryOptions.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryOptions.limit, 10) || 10);
  const { completed, sortBy = "createdAt", order = "desc" } = queryOptions;

  const filter = {};

  if (completed !== undefined && completed !== "") {
    filter.completed = completed === "true";
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email"),
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    todos,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
}

async function getTodoById(id) {
  return await Todo.findById(id);
}

async function updateTodo(id, data) {
  return await Todo.findByIdAndUpdate(
    id,
    {
      title: data.title,
      description: data.description,
      completed: data.completed,
    },
    { new: true, runValidators: true }
  );
}

async function deleteTodo(id) {
  return await Todo.findByIdAndDelete(id);
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments();
  const completedTodos = await Todo.countDocuments({ completed: true });
  const pendingTodos = totalTodos - completedTodos;

  return { totalTodos, completedTodos, pendingTodos };
}

module.exports = {
  createTodo,
  getAllTodos,
  getAllTodosForAdmin,
  getTodoById,
  updateTodo,
  deleteTodo,
  getSummaryStats,
};