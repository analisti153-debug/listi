const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}": ${err.value}`;
  }
res.status(statusCode).json({
  success: false,
  message,

  stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
});
};

module.exports = errorHandler;