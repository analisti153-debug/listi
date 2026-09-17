const ActivityLog = require("../models/activity-log.model");

async function createActivityLog(data) {
  return await ActivityLog.create({
    action: data.action,
    entity: data.entity || "Todo",
    entityId: data.entityId,
    user: data.user,
  });
}

async function getAllActivityLogs() {
  return await ActivityLog.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
}

module.exports = {
  createActivityLog,
  getAllActivityLogs,
};