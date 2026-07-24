import jwt from "jsonwebtoken";

import ApiError from "./ApiError.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Generate OTP Verification Token
 */
export const generateOTPToken = (payload) => {
  return jwt.sign(payload, process.env.OTP_SECRET, {
    expiresIn: process.env.OTP_EXPIRES_IN,
  });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token.");
  }
};

/**
 * Verify OTP Verification Token
 */
export const verifyOTPToken = (token) => {
  try {
    return jwt.verify(token, process.env.OTP_SECRET);
  } catch (error) {
    throw new ApiError(401, "OTP verification token has expired.");
  }
};

export const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});