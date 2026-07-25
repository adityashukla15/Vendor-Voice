import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import { successResponse } from "../utils/response.js";

import {
  generateAndSendOTP,
  verifyOTP,
} from "../services/otp.service.js";

import { OTP_PURPOSE } from "../constants/otp.constants.js";

/**
 * @desc    Send Registration OTP
 * @route   POST /api/otp/send
 * @access  Public
 */
export const sendRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, name, purpose } = req.body;

  if (!email || !purpose) {
    throw new ApiError(
      400,
      "Email and purpose are required."
    );
  }

  const result = await generateAndSendOTP({
    email,
    name: name || email,
    purpose,
  });

  return successResponse(
    res,
    200,
    "OTP sent successfully.",
    process.env.NODE_ENV === "production"
      ? null
      : { otp: result.otp }
  );
});

/**
 * @desc    Verify Registration OTP
 * @route   POST /api/otp/verify
 * @access  Public
 */
export const verifyRegistrationOTP = asyncHandler(async (req, res) => {
   const { email, otp, purpose } = req.body;

  if (!email || !otp || !purpose) {
    throw new ApiError(
      400,
      "Email, OTP and purpose are required."
    );
  }

  const verificationToken = await verifyOTP({
    email,
    otp,
    purpose,
  });

  return successResponse(
    res,
    200,
    "OTP verified successfully.",
    {
      verificationToken,
    }
  );
});

