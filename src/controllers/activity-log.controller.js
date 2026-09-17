const activityLogService = require("../services/activity-log.service");
const catchAsync = require("../utils/catchAsync");

const getAllActivityLogs = catchAsync(async (req, res) => {
  const logs = await activityLogService.getAllActivityLogs();

  res.status(200).json({
    success: true,
    data: logs,
  });
});

module.exports = {
  getAllActivityLogs,
};