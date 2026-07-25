import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { sendWhatsAppReminder } from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.use(protect);
router.post("/send-reminder", sendWhatsAppReminder);

export default router;
