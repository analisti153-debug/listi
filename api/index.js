require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/config/db");

// Middleware untuk memastikan database terhubung sebelum menangani request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Gagal terhubung ke database" 
    });
  }
});

// Export aplikasi Express
module.exports = app;