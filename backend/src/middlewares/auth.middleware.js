import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Protect Routes
 * Checks authentication using Cookie or Bearer Token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  /**
   * Cookie Authentication
   */
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  /**
   * Authorization Header
   */
  if (
    !token &&
    req.headers.authorization?.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized. Please login first.");
  }

  // Verify JWT
  const decoded = verifyAccessToken(token);

  // Find User
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your account.");
  }

  req.user = user;

  next();
});

export default protect;