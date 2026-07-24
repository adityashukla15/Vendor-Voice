import express from "express";

import protect from "../middlewares/auth.middleware.js";

import {
  dashboardOverview,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(protect);

// Dashboard Overview
router.get("/overview", dashboardOverview);

export default router;