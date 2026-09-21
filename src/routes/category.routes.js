const express = require("express");

const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori Todo
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Belajar
 *               description:
 *                 type: string
 *                 example: Kategori untuk kegiatan belajar
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Data kategori tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 */
router.post("/", categoryController.createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mengambil semua kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mengambil kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil ditemukan
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mengubah kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sekolah
 *               description:
 *                 type: string
 *                 example: Kategori tugas sekolah
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:id", categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;