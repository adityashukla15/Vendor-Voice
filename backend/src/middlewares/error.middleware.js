const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /**
   * Mongoose Validation Error
   */
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  /**
   * Duplicate Key Error
   * Example: Email already exists
   */
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  /**
   * Invalid Mongo ObjectId
   */
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  /**
   * JWT Errors
   */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  return res.status(statusCode).json({
    success: false,
    message,

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;