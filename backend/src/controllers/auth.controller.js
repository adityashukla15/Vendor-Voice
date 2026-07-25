import asyncHandler from "../utils/asyncHandler.js";
import  ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/response.js";

import {registerUser,loginUser,forgotPassword as forgotPasswordService,resetPassword as resetPasswordService,} from "../services/auth.service.js";

import { getAccessTokenCookieOptions } from "../utils/jwt.js";

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    shopName,
    preferredLanguage,
    verificationToken,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !shopName ||
    !verificationToken
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  const { user, accessToken } = await registerUser({
    name,
    email,
    password,
    phone,
    shopName,
    preferredLanguage,
    verificationToken,
  });

  res.cookie(
    "accessToken",
    accessToken,
    getAccessTokenCookieOptions()
  );

  return successResponse(
    res,
    201,
    "Account created successfully.",
    {
      user,
    }
  );
});

export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required."
    );
  }

  const { user, accessToken } =
    await loginUser({
      email,
      password,
    });

  res.cookie(
    "accessToken",
    accessToken,
    getAccessTokenCookieOptions()
  );

  return successResponse(
    res,
    200,
    "Login successful.",
    {
      user,
    }
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse(
    res,
    200,
    "Logged out successfully."
  );
});


export const forgotPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email) {
    throw new ApiError(
      400,
      "Email is required."
    );
  }

  await forgotPasswordService({
    email,
  });

  return successResponse(
    res,
    200,
    "Password reset OTP sent successfully."
  );
});

export const resetPassword = asyncHandler(async (req, res) => {

  const {
    email,
    verificationToken,
    newPassword,
  } = req.body;

  if (
    !email ||
    !verificationToken ||
    !newPassword
  ) {
    throw new ApiError(
      400,
      "All fields are required."
    );
  }

  await resetPasswordService({
    email,
    verificationToken,
    newPassword,
  });

  return successResponse(
    res,
    200,
    "Password reset successfully."
  );
});

export const me = asyncHandler(async (req, res) => {
  return successResponse(
    res,
    200,
    "Current user retrieved successfully.",
    {
      user: req.user,
    }
  );
});