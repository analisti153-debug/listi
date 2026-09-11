const mongoose = require("mongoose");

const connectDB = async () => {
  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
    return db;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    throw error;
  }
};

module.exports = connectDB;