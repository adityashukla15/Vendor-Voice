import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Customer name is required."],
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number."],
      default: null,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    outstandingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTransactions: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate customer names for the same shopkeeper
customerSchema.index(
  {
    owner: 1,
    name: 1,
  },
  {
    unique: true,
  }
);
  
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;