import { Router } from "express";

import {
  sendRegistrationOTP,
  verifyRegistrationOTP,
} from "../controllers/otp.controller.js";

const router = Router();

/**
 * @route   POST /api/otp/send
 * @desc    Send registration OTP
 * @access  Public
 */
router.post("/send", sendRegistrationOTP);

/**
 * @route   POST /api/otp/verify
 * @desc    Verify registration OTP
 * @access  Public
 */
router.post("/verify", verifyRegistrationOTP);


export default router;