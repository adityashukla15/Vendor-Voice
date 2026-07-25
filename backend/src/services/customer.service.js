import Customer from "../models/customer.model.js";
import ApiError from "../utils/apiError.js";    


export const createCustomer = async ({
  owner,
  name,
  phone,
  address,
}) => {

  const existingCustomer = await Customer.findOne({
    owner,
    name: name.trim(),
    isActive: true,
  });

  if (existingCustomer) {
    throw new ApiError(
      409,
      "Customer already exists."
    );
  }

  const customer = await Customer.create({
    owner,
    name: name.trim(),
    phone,
    address,
  });

  return customer;
};

/**
 * Get All Customers
 */
export const getCustomers = async (owner) => {

  return await Customer.find({
    owner,
    isActive: true,
  }).sort({
    createdAt: -1,
  });

};

/**
 * Get Customer By ID
 */
export const getCustomerById = async ({
  owner,
  customerId,
}) => {

  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found."
    );
  }

  return customer;
};

/**
 * Update Customer
 */
export const updateCustomer = async ({
  owner,
  customerId,
  updateData,
}) => {

  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found."
    );
  }

  Object.assign(customer, updateData);

  await customer.save();

  return customer;
};

/**
 * Delete Customer (Soft Delete)
 */
export const deleteCustomer = async ({
  owner,
  customerId,
}) => {

  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found."
    );
  }

  customer.isActive = false;

  await customer.save();

  return true;
};

/**
 * Search Customers
 */
export const searchCustomers = async ({
  owner,
  keyword,
}) => {

  return await Customer.find({
    owner,
    isActive: true,
    name: {
      $regex: keyword,
      $options: "i",
    },
  });

};