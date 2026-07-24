import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import otpRoutes from "../src/routes/otp.routes.js"
import  authRoutes from "../src/routes/auth.routes.js"
import cookieParser from "cookie-parser";
import  inventoryRoutes from "../src/routes/inventory.routes.js"
import  customerRoutes from "../src/routes/customer.routes.js"
import ledgerRoutes from "../src/routes/legder.routes.js"
import dashboardRoutes from "../src/routes/dashboard.routes.js"

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware) 

app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api/customer',customerRoutes)
app.use('/api/ledger',ledgerRoutes)
app.use('/api/dashboard',dashboardRoutes)

export default app;