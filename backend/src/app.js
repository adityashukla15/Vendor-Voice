import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import otpRoutes from "../src/routes/otp.routes.js"
import  authRoutes from "../src/routes/auth.routes.js"
import cookieParser from "cookie-parser";
import  inventoryRoutes from "../src/routes/inventory.routes.js"
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware) 

app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

export default app;