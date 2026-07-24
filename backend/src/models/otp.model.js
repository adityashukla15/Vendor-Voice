import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
      select: false,
    },

    purpose: {
      type: String,
      enum: ["REGISTER", "RESET_PASSWORD"],
      required: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * MongoDB TTL Index
 * Document will be automatically deleted
 * when expiresAt time is reached.
 */
otpSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;