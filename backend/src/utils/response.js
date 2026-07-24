/**
 * Success Response
 */
export const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response
 */
export const errorResponse = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};