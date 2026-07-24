import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

   inventory: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Inventory",
  default: null,
},

quantity: {
  type: Number,
  default: 0,
},

unitPrice: {
  type: Number,
  default: 0,
},

totalAmount: {
  type: Number,
  default: 0,
},

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: [
        "CASH",
        "CREDIT",
        "PARTIAL",
      ],
      required: true,
    },

    transactionType: {
      type: String,
      enum: [
        "SALE",
        "PAYMENT",
      ],
      default: "SALE",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    createdByAI: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;