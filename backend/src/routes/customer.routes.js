import express  from 'express'

import  protect from '../middlewares/auth.middleware.js'

import {
  createNewCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateExistingCustomer,
  removeCustomer,
  searchCustomer,
} from "../controllers/customer.controller.js";


const router = express.Router();

router.use(protect);

// Create Customer
router.post("/create", createNewCustomer);

// Get All Customers
router.get("/all", getAllCustomers);

// Search Customer
router.get("/search", searchCustomer);

// Get Single Customer
router.get("/:id", getSingleCustomer);

// Update Customer
router.put("/update/:id", updateExistingCustomer);

// Delete Customer
router.delete("/delete/:id", removeCustomer);

export default router;