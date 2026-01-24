const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      success: false,
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPatterns)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      success: false,
    });
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      success: false,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenErrors") {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired",
      success: false,
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
    success: false,
  });
};

export default errorHandler;
