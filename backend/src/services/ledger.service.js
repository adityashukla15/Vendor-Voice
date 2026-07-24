import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";
import Inventory from "../models/inventory.model.js";
import ApiError from "../utils/ApiError.js";

export const createSaleTransaction = async ({
  owner,
  customerId,
  inventoryId,
  quantity,
  paidAmount = 0,
  notes,
  createdByAI = false,
}) => {

  // Find Customer
  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  // Find Product
  const product = await Inventory.findOne({
    _id: inventoryId,
    owner,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Stock Check
  if (product.quantity < quantity) {
    throw new ApiError(
      400,
      "Insufficient stock available."
    );
  }

  const totalAmount = quantity * product.sellingPrice;
  const dueAmount = totalAmount - paidAmount;

  let paymentType = "CREDIT";

  if (paidAmount === totalAmount) {
    paymentType = "CASH";
  } else if (paidAmount > 0) {
    paymentType = "PARTIAL";
  }

  // Reduce Inventory
  product.quantity -= quantity;
  await product.save();

  // Update Customer
  customer.outstandingBalance += dueAmount;
  customer.totalTransactions += 1;

  await customer.save();

  // Save Transaction
  const transaction = await Transaction.create({
    owner,
    customer: customer._id,
    inventory: product._id,
    quantity,
    unitPrice: product.sellingPrice,
    totalAmount,
    paidAmount,
    dueAmount,
    paymentType,
    transactionType: "SALE",
    notes,
    createdByAI,
  });

  return transaction;
};

/**
 * Receive Payment
 */
export const receivePayment = async ({
  owner,
  customerId,
  amount,
  notes,
}) => {

  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  if (amount > customer.outstandingBalance) {
    throw new ApiError(
      400,
      "Payment exceeds outstanding balance."
    );
  }

  customer.outstandingBalance -= amount;

  await customer.save();

  const transaction = await Transaction.create({
    owner,
    customer: customer._id,
    paidAmount: amount,
    transactionType: "PAYMENT",
    paymentType: "CASH",
    notes,
  });

  return transaction;
};

/**
 * Get All Transactions
 */
export const getTransactions = async (owner) => {

  return await Transaction.find({
    owner,
    isDeleted: false,
  })
    .populate("customer", "name phone")
    .populate("inventory", "productName")
    .sort({
      createdAt: -1,
    });

};

/**
 * Delete Transaction
 */
export const deleteTransaction = async ({
  owner,
  transactionId,
}) => {

  const transaction = await Transaction.findOne({
    _id: transactionId,
    owner,
    isDeleted: false,
  });

  if (!transaction) {
    throw new ApiError(
      404,
      "Transaction not found."
    );
  }

  transaction.isDeleted = true;

  await transaction.save();

  return true;
};