import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { successResponse } from "../utils/response.js";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../services/customer.service.js";

/**
 * @desc Create Customer
 * @route POST /api/customer/create
 * @access Private
 */
export const createNewCustomer = asyncHandler(async (req, res) => {

  const {
    name,
    phone,
    address,
  } = req.body;

  if (!name) {
    throw new ApiError(
      400,
      "Customer name is required."
    );
  }

  const customer = await createCustomer({
    owner: req.user._id,
    name,
    phone,
    address,
  });

  return successResponse(
    res,
    201,
    "Customer created successfully.",
    {
      customer,
    }
  );
});

/**
 * @desc Get All Customers
 * @route GET /api/customer/all
 * @access Private
 */
export const getAllCustomers = asyncHandler(async (req, res) => {

  const customers = await getCustomers(req.user._id);

  return successResponse(
    res,
    200,
    "Customers fetched successfully.",
    {
      customers,
    }
  );
});

/**
 * @desc Get Customer By ID
 * @route GET /api/customer/:id
 * @access Private
 */
export const getSingleCustomer = asyncHandler(async (req, res) => {

  const customer = await getCustomerById({
    owner: req.user._id,
    customerId: req.params.id,
  });

  return successResponse(
    res,
    200,
    "Customer fetched successfully.",
    {
      customer,
    }
  );
});

/**
 * @desc Update Customer
 * @route PUT /api/customer/update/:id
 * @access Private
 */
export const updateExistingCustomer = asyncHandler(async (req, res) => {

  const allowedUpdates = [
    "name",
    "phone",
    "address",
  ];

  const updateData = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(
      400,
      "No valid fields provided for update."
    );
  }

  const customer = await updateCustomer({
    owner: req.user._id,
    customerId: req.params.id,
    updateData,
  });

  return successResponse(
    res,
    200,
    "Customer updated successfully.",
    {
      customer,
    }
  );
});

/**
 * @desc Delete Customer
 * @route DELETE /api/customer/delete/:id
 * @access Private
 */
export const removeCustomer = asyncHandler(async (req, res) => {

  await deleteCustomer({
    owner: req.user._id,
    customerId: req.params.id,
  });

  return successResponse(
    res,
    200,
    "Customer deleted successfully."
  );
});

/**
 * @desc Search Customers
 * @route GET /api/customer/search
 * @access Private
 */
export const searchCustomer = asyncHandler(async (req, res) => {

  const { keyword } = req.query;

  if (!keyword) {
    throw new ApiError(
      400,
      "Search keyword is required."
    );
  }

  const customers = await searchCustomers({
    owner: req.user._id,
    keyword,
  });

  return successResponse(
    res,
    200,
    "Customers fetched successfully.",
    {
      customers,
    }
  );
});