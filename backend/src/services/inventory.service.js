import Inventory from "../models/inventory.model.js";
import ApiError from "../utils/apiError.js";

/**
 * Create Product
 */
export const createProduct = async ({
  owner,
  productName,
  category,
  sku,
  quantity,
  unit,
  buyingPrice,
  sellingPrice,
  lowStockThreshold,
  barcode,
}) => {

  const existingProduct = await Inventory.findOne({
    owner,
    productName: productName.trim(),
    isActive: true,
  });

  if (existingProduct) {
    throw new ApiError(
      409,
      "Product already exists in inventory."
    );
  }

  const product = await Inventory.create({
    owner,
    productName: productName.trim(),
    category,
    sku,
    quantity,
    unit,
    buyingPrice,
    sellingPrice,
    lowStockThreshold,
    barcode,
  });

  return product;
};

/**
 * Get All Products
 */
export const getProducts = async (owner) => {

  return await Inventory.find({
    owner,
    isActive: true,
  }).sort({
    createdAt: -1,
  });

};

/**
 * Get Product By ID
 */
export const getProductById = async ({
  owner,
  productId,
}) => {

  const product = await Inventory.findOne({
    _id: productId,
    owner,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  return product;
};

/**
 * Update Product
 */
export const updateProduct = async ({
  owner,
  productId,
  updateData,
}) => {

  const product = await Inventory.findOne({
    _id: productId,
    owner,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  Object.assign(product, updateData);

  await product.save();

  return product;
};

/**
 * Soft Delete Product
 */
export const deleteProduct = async ({
  owner,
  productId,
}) => {

  const product = await Inventory.findOne({
    _id: productId,
    owner,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  product.isActive = false;

  await product.save();

  return true;
};

/**
 * Search Products
 */
export const searchProducts = async ({
  owner,
  keyword,
}) => {

  return await Inventory.find({
    owner,
    isActive: true,
    productName: {
      $regex: keyword,
      $options: "i",
    },
  });

};

/**
 * Get Low Stock Products
 */
export const getLowStockProducts = async (owner) => {
  return await Inventory.aggregate([
    {
      $match: {
        owner,
        isActive: true,
      },
    },
    {
      $match: {
        $expr: {
          $lte: ["$quantity", "$lowStockThreshold"],
        },
      },
    },
    {
      $sort: {
        quantity: 1,
      },
    },
  ]);
};