import express from "express";

import protect from "../middlewares/auth.middleware.js";

import {
  createInventory,
  getInventory,
  getSingleProduct,
  updateInventory,
  removeInventory,
  searchInventory,
  lowStockInventory,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.use(protect);

// Create Product
router.post("/create", createInventory);

// Get All Products
router.get("/all", getInventory);

// Search Products
router.get("/search", searchInventory);

// Low Stock Products
router.get("/low-stock", lowStockInventory);

// Get Single Product
router.get("/:id", getSingleProduct);

// Update Product
router.put("/update/:id", updateInventory);

// Delete Product
router.delete("/delete/:id", removeInventory);

export default router;