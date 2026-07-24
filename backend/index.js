import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import { verifyMailConnection } from "./src/config/mail.js";

app.use(cors());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDB();
    await verifyMailConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error);
    process.exit(1);
  }
};

startServer();