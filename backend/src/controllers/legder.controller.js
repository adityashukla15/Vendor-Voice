import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/response.js";

import {
  createSaleTransaction,
  receivePayment,
  getTransactions,
  deleteTransaction,
} from "../services/ledger.service.js";

/**
 * @desc Create Sale Transaction
 * @route POST /api/ledger/sale
 * @access Private
 */
export const createSale = asyncHandler(async (req, res) => {

  const {
    customerId,
    inventoryId,
    quantity,
    paidAmount,
    notes,
    createdByAI,
  } = req.body;

  if (
    !customerId ||
    !inventoryId ||
    !quantity
  ) {
    throw new ApiError(
      400,
      "Customer, Product and Quantity are required."
    );
  }

  const transaction = await createSaleTransaction({
    owner: req.user._id,
    customerId,
    inventoryId,
    quantity,
    paidAmount,
    notes,
    createdByAI,
  });

  return successResponse(
    res,
    201,
    "Transaction created successfully.",
    {
      transaction,
    }
  );
});

/**
 * @desc Receive Customer Payment
 * @route POST /api/ledger/payment
 * @access Private
 */
export const collectPayment = asyncHandler(async (req, res) => {

  const {
    customerId,
    amount,
    notes,
  } = req.body;

  if (!customerId || !amount) {
    throw new ApiError(
      400,
      "Customer and amount are required."
    );
  }

  const transaction = await receivePayment({
    owner: req.user._id,
    customerId,
    amount,
    notes,
  });

  return successResponse(
    res,
    200,
    "Payment received successfully.",
    {
      transaction,
    }
  );
});

/**
 * @desc Get All Transactions
 * @route GET /api/ledger/all
 * @access Private
 */
export const getAllTransactions = asyncHandler(async (req, res) => {

  const transactions = await getTransactions(
    req.user._id
  );

  return successResponse(
    res,
    200,
    "Transactions fetched successfully.",
    {
      transactions,
    }
  );
});

/**
 * @desc Delete Transaction
 * @route DELETE /api/ledger/delete/:id
 * @access Private
 */
export const removeTransaction = asyncHandler(async (req, res) => {

  await deleteTransaction({
    owner: req.user._id,
    transactionId: req.params.id,
  });

  return successResponse(
    res,
    200,
    "Transaction deleted successfully."
  );
});