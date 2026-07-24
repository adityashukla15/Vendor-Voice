import User from "../models/user.model.js";

import ApiError from "../utils/apiError.js";

import { generateAndSendOTP } from "./otp.service.js";

import {
  verifyOTPToken,
  generateAccessToken,
} from "../utils/jwt.js";


import { OTP_PURPOSE } from "../constants/otp.constants.js";

export const registerUser = async ({
  name,
  email,
  password,
  phone,
  shopName,
  preferredLanguage,
  verificationToken,
}) => {

  // Verify OTP Token
  const decoded = verifyOTPToken(verificationToken);

  // Validate token purpose
  if (decoded.purpose !== OTP_PURPOSE.REGISTER) {
    throw new ApiError(401, "Invalid verification token.");
  }

  // Validate token state
  if (!decoded.verified) {
    throw new ApiError(401, "Email is not verified.");
  }

  // Email should match
  if (decoded.email !== email) {
    throw new ApiError(
      401,
      "Verification token does not belong to this email."
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email is already registered."
    );
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    phone,
    shopName,
    preferredLanguage,
    isVerified: true,
  });

  // Generate Access Token
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    shopName: user.shopName,
  });

  return {
    user,
    accessToken,
  };
};

export const loginUser = async ({
  email,
  password,
}) => {

  const user = await User.findOne({ email })
    .select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const isPasswordCorrect =
    await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
  });

  return {
    user,
    accessToken,
  };
};

export const forgotPassword = async ({ email }) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "No account found with this email."
    );
  }

  await generateAndSendOTP({
    email,
    name: user.name,
    purpose: OTP_PURPOSE.RESET_PASSWORD,
  });

  return true;
};

export const resetPassword = async ({
  email,
  verificationToken,
  newPassword,
}) => {

  // Verify JWT
  const decoded = verifyOTPToken(verificationToken);

  if (decoded.purpose !== OTP_PURPOSE.RESET_PASSWORD) {
    throw new ApiError(
      401,
      "Invalid verification token."
    );
  }

  if (!decoded.verified) {
    throw new ApiError(
      401,
      "Email is not verified."
    );
  }

  if (decoded.email !== email) {
    throw new ApiError(
      401,
      "Verification token does not belong to this email."
    );
  }

  // Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  // Update password
  user.password = newPassword;

  await user.save();

  return true;
};
