const mongoose = require("mongoose");

const Todo = require("../models/todo.model");

const activityLogService = require("./activity-log.service");

function buildTodoSnapshot(todo) {
  if (!todo) {
    return null;
  }

  const category = todo.category;

  return {
    _id: todo._id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    archived: todo.archived,
    category: category
      ? {
          _id: category._id || category,
          name: category.name || null,
        }
      : null,
  };
}

async function createTodo(data) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    completed: data.completed ?? false,
    category: data.category,
    owner: data.owner,
    created_by: data.userId,
    updated_by: data.userId,
    archived: data.archived ?? false,
  });

  const savedTodo = await todo.save();

  const populatedTodo = await Todo.findById(savedTodo._id)
    .populate("category", "name")
    .populate("owner", "name email");

  if (data.userId) {
    await activityLogService.createActivityLog({
      action: "create",
      entity: "Todo",
      entityId: savedTodo._id,
      user: data.userId,
      snapshot: buildTodoSnapshot(populatedTodo),
    });
  }

  return populatedTodo;
}

async function getAllTodos(ownerId, queryOptions = {}) {
  const page = Math.max(1, parseInt(queryOptions.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryOptions.limit, 10) || 10);

  const {
    completed,
    sortBy = "createdAt",
    order = "desc",
    search,
  } = queryOptions;

  const filterOwner = mongoose.Types.ObjectId.isValid(ownerId)
    ? new mongoose.Types.ObjectId(ownerId)
    : ownerId;

  const filter = {
    owner: filterOwner,
  };

  if (completed !== undefined && completed !== "") {
    filter.completed = completed === "true";
  }

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
    ];
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate("category", "name"),

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

  const {
    completed,
    sortBy = "createdAt",
    order = "desc",
    search,
  } = queryOptions;

  const filter = {};

  if (completed !== undefined && completed !== "") {
    filter.completed = completed === "true";
  }

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
    ];
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email")
      .populate("category", "name"),

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
  return await Todo.findById(id)
    .populate("category", "name")
    .populate("owner", "name email");
}

async function updateTodo(id, data) {
  const updateData = {
    title: data.title,
    description: data.description,
    completed: data.completed,
    updated_by: data.userId,
  };

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (data.archived !== undefined) {
    updateData.archived = data.archived;
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name")
    .populate("owner", "name email");

  if (updatedTodo && data.userId) {
    await activityLogService.createActivityLog({
      action: "update",
      entity: "Todo",
      entityId: updatedTodo._id,
      user: data.userId,
      snapshot: buildTodoSnapshot(updatedTodo),
    });
  }

  return updatedTodo;
}

async function deleteTodo(id, userId) {
  const todoToDelete = await Todo.findById(id).populate(
    "category",
    "name"
  );

  if (!todoToDelete) {
    return null;
  }

  const snapshot = buildTodoSnapshot(todoToDelete);

  await Todo.findByIdAndDelete(id);

  if (userId) {
    await activityLogService.createActivityLog({
      action: "delete",
      entity: "Todo",
      entityId: todoToDelete._id,
      user: userId,
      snapshot: snapshot,
    });
  }

  return todoToDelete;
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments();

  const completedTodos = await Todo.countDocuments({
    completed: true,
  });

  const pendingTodos = totalTodos - completedTodos;

  return {
    totalTodos,
    completedTodos,
    pendingTodos,
  };
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