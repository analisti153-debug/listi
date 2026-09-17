const express = require("express");

const activityLogController = require("../controllers/activity-log.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/", activityLogController.getAllActivityLogs);

module.exports = router;