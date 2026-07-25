import { Router } from "express";

import { register, login, logout, forgotPassword, resetPassword, me } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router