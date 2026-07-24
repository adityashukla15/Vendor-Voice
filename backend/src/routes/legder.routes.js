import express from "express";

import protect from  "../middlewares/auth.middleware.js";

import {
  createSale,
  collectPayment,
  getAllTransactions,
  removeTransaction,
} from "../controllers/legder.controller.js";

const router = express.Router();

router.use(protect);

// Create Sale
router.post("/sale", createSale);

// Receive Payment
router.post("/payment", collectPayment);

// Get All Transactions
router.get("/all", getAllTransactions);

// Delete Transaction
router.delete("/delete/:id", removeTransaction);

export default router;