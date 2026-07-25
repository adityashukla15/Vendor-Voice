import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { successResponse } from "../utils/response.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStockProducts,
} from "../services/inventory.service.js";

/**
 * @desc Create Product
 * @route POST /api/inventory
 * @access Private
 */
export const createInventory = asyncHandler(async (req, res) => {

  const {
    productName,
    category,
    sku,
    quantity,
    unit,
    buyingPrice,
    sellingPrice,
    lowStockThreshold,
    barcode,
  } = req.body;

  if (
    !productName ||
    quantity === undefined ||
    buyingPrice === undefined ||
    sellingPrice === undefined
  ) {
    throw new ApiError(
      400,
      "Product name, quantity, buying price and selling price are required."
    );
  }

  const product = await createProduct({
    owner: req.user._id,
    productName,
    category,
    sku,
    quantity,
    unit,
    buyingPrice,
    sellingPrice,
    lowStockThreshold,
    barcode,
  });

  return successResponse(
    res,
    201,
    "Product created successfully.",
    { product }
  );
});

/**
 * @desc Get All Products
 * @route GET /api/inventory
 * @access Private
 */
export const getInventory = asyncHandler(async (req, res) => {

  const products = await getProducts(req.user._id);

  return successResponse(
    res,
    200,
    "Products fetched successfully.",
    { products }
  );
});

/**
 * @desc Get Product By ID
 * @route GET /api/inventory/:id
 * @access Private
 */
export const getSingleProduct = asyncHandler(async (req, res) => {

  const product = await getProductById({
    owner: req.user._id,
    productId: req.params.id,
  });

  return successResponse(
    res,
    200,
    "Product fetched successfully.",
    { product }
  );
});

/**
 * @desc Update Product
 * @route PUT /api/inventory/:id
 * @access Private
 */
export const updateInventory = asyncHandler(async (req, res) => {

  // Only allow these fields to be updated
  const allowedUpdates = [
    "productName",
    "category",
    "sku",
    "quantity",
    "unit",
    "buyingPrice",
    "sellingPrice",
    "lowStockThreshold",
    "barcode",
  ];

  const updateData = {};

  // Filter incoming request body
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // If no valid fields provided
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(
      400,
      "No valid fields provided for update."
    );
  }

  const product = await updateProduct({
    owner: req.user._id,
    productId: req.params.id,
    updateData,
  });

  return successResponse(
    res,
    200,
    "Product updated successfully.",
    {
      product,
    }
  );
});
/**
 * @desc Delete Product
 * @route DELETE /api/inventory/:id
 * @access Private
 */
export const removeInventory = asyncHandler(async (req, res) => {

  await deleteProduct({
    owner: req.user._id,
    productId: req.params.id,
  });

  return successResponse(
    res,
    200,
    "Product deleted successfully."
  );
});

/**
 * @desc Search Products
 * @route GET /api/inventory/search
 * @access Private
 */
export const searchInventory = asyncHandler(async (req, res) => {

  const { keyword } = req.query;

  if (!keyword) {
    throw new ApiError(
      400,
      "Search keyword is required."
    );
  }

  const products = await searchProducts({
    owner: req.user._id,
    keyword,
  });

  return successResponse(
    res,
    200,
    "Products fetched successfully.",
    { products }
  );
});

/**
 * @desc Low Stock Products
 * @route GET /api/inventory/low-stock
 * @access Private
 */
export const lowStockInventory = asyncHandler(async (req, res) => {

  const products = await getLowStockProducts(req.user._id);

  return successResponse(
    res,
    200,
    "Low stock products fetched successfully.",
    { products }
  );
});