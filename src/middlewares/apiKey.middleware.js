const AppError = require("../utils/AppError");

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return next(new AppError("API key is missing", 401));
  }

  const validApiKey =
    process.env.EXTERNAL_API_KEY ||
    process.env.API_KEY ||
    "kunci-rahasia-test";

  if (apiKey !== validApiKey) {
    return next(new AppError("Invalid API key", 401));
  }

  next();
};

module.exports = checkApiKey;