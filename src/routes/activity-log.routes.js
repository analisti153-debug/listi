const express = require("express");

const activityLogController = require("../controllers/activity-log.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Activity Logs
 *   description: Riwayat aktivitas Todo
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Mengambil semua activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity log berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665f1c2e8b1e2a1a2c3d4e5f
 *
 *                       action:
 *                         type: string
 *                         enum:
 *                           - create
 *                           - update
 *                           - delete
 *                         example: create
 *
 *                       entity:
 *                         type: string
 *                         example: Todo
 *
 *                       entityId:
 *                         type: string
 *                         example: 665f1a2b8b1e2a1a2c3d1111
 *
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Listiana
 *                           email:
 *                             type: string
 *                             example: user@example.com
 *                           role:
 *                             type: string
 *                             example: user
 *
 *                       snapshot:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 665f1c2e8b1e2a1a2c3d4e5f
 *                           title:
 *                             type: string
 *                             example: Belajar Node.js
 *                           description:
 *                             type: string
 *                             example: Mempelajari Activity Log
 *                           completed:
 *                             type: boolean
 *                             example: false
 *                           archived:
 *                             type: boolean
 *                             example: false
 *                           category:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 665f1c2e8b1e2a1a2c3d4e5f
 *                               name:
 *                                 type: string
 *                                 example: Pekerjaan
 *
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 */

router.get("/", activityLogController.getAllActivityLogs);

module.exports = router;