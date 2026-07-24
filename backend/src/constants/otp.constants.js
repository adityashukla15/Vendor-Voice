/**
 * OTP Purposes
 */
export const OTP_PURPOSE = Object.freeze({
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
});

/**
 * OTP Configuration
 */
export const OTP_CONFIG = Object.freeze({
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 5,
});