const mongoose = require("mongoose");

const Todo = require("../models/todo.model");

const activityLogService = require("./activity-log.service");

async function createTodo(data) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    owner: data.owner,
    created_by: data.userId,
    updated_by: data.userId,
  });

  const savedTodo = await todo.save();

  if (data.userId) {
    await activityLogService.createActivityLog({
      action: "create",
      entity: "Todo",
      entityId: savedTodo._id,
      user: data.userId,
    });
  }

  return savedTodo;
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
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    {
      title: data.title,
      description: data.description,
      completed: data.completed,
      updated_by: data.userId,

      ...(data.archived !== undefined && {
        archived: data.archived,
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (updatedTodo && data.userId) {
    await activityLogService.createActivityLog({
      action: "update",
      entity: "Todo",
      entityId: updatedTodo._id,
      user: data.userId,
    });
  }

  return updatedTodo;
}

async function deleteTodo(id, userId) {
  const deletedTodo = await Todo.findByIdAndDelete(id);

  if (deletedTodo && userId) {
    await activityLogService.createActivityLog({
      action: "delete",
      entity: "Todo",
      entityId: deletedTodo._id,
      user: userId,
    });
  }

  return deletedTodo;
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