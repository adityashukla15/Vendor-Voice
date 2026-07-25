import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { processVoice } from "../controllers/ai.controller.js";

const router = express.Router();

router.use(protect);
router.post("/process", processVoice);

export default router;
