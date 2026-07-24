import bcrypt from "bcryptjs";

import OTP from "../models/OTP.js";

import generateOTP from "../utils/generateOTP.js";

import { sendEmail } from "./mail.service.js";

import otpTemplate from "../templates/otp.template.js";

import { OTP_CONFIG } from "../constants/otp.constants.js";

import ApiError from "../utils/apiError.js";

/**
 * Generate & Send OTP
 */
export const generateAndSendOTP = async ({
  email,
  name,
  purpose,
}) => {
  // Delete previous OTP if exists
  await OTP.deleteMany({
    email,
    purpose,
  });

  // Generate OTP
  const otp = generateOTP(OTP_CONFIG.LENGTH);

  // Hash OTP
  const hashedOTP = await bcrypt.hash(otp, 12);

  // Expiry Time
  const expiresAt = new Date(
    Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000
  );

  // Save OTP
  await OTP.create({
    email,
    otp: hashedOTP,
    purpose,
    expiresAt,
  });

  // Send Email
  await sendEmail({
    to: email,
    subject: "Verify Your Vendor Voice Account",
    html: otpTemplate(name, otp),
    text: `Your OTP is ${otp}`,
  });

  return true;
};
export const verifyOTP = async ({
  email,
  otp,
  purpose,
}) => {

  const otpDoc = await OTP.findOne({
    email,
    purpose,
  }).select("+otp");

  if (!otpDoc) {
    throw new ApiError(404, "OTP not found or expired.");
  }

  // Expiry Check
  if (otpDoc.expiresAt < new Date()) {

    await OTP.deleteOne({
      _id: otpDoc._id,
    });

    throw new ApiError(400, "OTP has expired.");
  }

  // Attempt Limit
  if (otpDoc.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {

    await OTP.deleteOne({
      _id: otpDoc._id,
    });

    throw new ApiError(
      429,
      "Maximum verification attempts exceeded. Please request a new OTP."
    );
  }

  // Compare OTP
  const isValidOTP = await bcrypt.compare(
    otp,
    otpDoc.otp
  );

  if (!isValidOTP) {

    otpDoc.attempts += 1;

    await otpDoc.save();

    throw new ApiError(400, "Invalid OTP.");
  }

  // OTP Verified
  await OTP.deleteOne({
    _id: otpDoc._id,
  });

  return true;
};