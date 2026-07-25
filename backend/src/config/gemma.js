import dotenv from "dotenv";

dotenv.config();

const gemmaConfig = {
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
  model: process.env.GEMMA_MODEL || process.env.GEMINI_MODEL || "gemini-2.0-flash",
};

export const getGemmaConfig = () => ({ ...gemmaConfig });

export default gemmaConfig;
