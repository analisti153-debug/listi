const todoService = require("../services/todo.service");

const getSummary = async (req, res, next) => {
  try {
    const stats = await todoService.getSummaryStats();

    res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      data: {
        totalTodos: stats.totalTodos,
        completedTodos: stats.completedTodos,
        pendingTodos: stats.pendingTodos,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
};