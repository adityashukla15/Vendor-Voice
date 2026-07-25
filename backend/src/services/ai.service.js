import { GoogleGenAI } from "@google/genai";
import ApiError from "../utils/apiError.js";
import { getGemmaConfig } from "../config/gemma.js";
import { createSaleTransaction, receivePayment } from "./ledger.service.js";
import { searchProducts } from "./inventory.service.js";
import { searchCustomers } from "./customer.service.js";

const gemmaConfig = getGemmaConfig();
const ai = new GoogleGenAI({ apiKey: gemmaConfig.apiKey });

const SYSTEM_PROMPT = `You are a transaction extraction assistant for a shop bookkeeping system.
Extract transaction details from the user's natural language message.
Always return strict JSON only. Do not wrap in markdown, code fences, explanations, or any extra text.
Your response must be valid JSON with this exact shape:
{
  "intent": "SALE" | "PAYMENT",
  "customerName": "string",
  "productName": "string | null",
  "quantity": "number | null",
  "totalAmount": "number | null",
  "paidAmount": "number | null",
  "notes": "string"
}
Rules:
- If the message describes a purchase/sale, return intent "SALE".
- If the message describes a payment received from a customer, return intent "PAYMENT".
- For SALE, include customerName, productName, quantity, totalAmount, paidAmount, and notes.
- For PAYMENT, include customerName, paidAmount, and notes.
- Use null for missing values.
- If the user says paid 500 rupees, infer PAYMENT with paidAmount 500.
- If the message is ambiguous, still return the best possible structured JSON.
- Never include markdown, comments, code fences, or extra text.`;

const normalizeJson = (raw) => {
  if (!raw || typeof raw !== "string") return null;

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const candidate = start !== -1 && end !== -1 && end > start ? cleaned.slice(start, end + 1) : cleaned;

  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
};

const validateExtraction = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ApiError(422, "AI extraction returned invalid data.");
  }

  const intent = payload.intent;
  if (intent !== "SALE" && intent !== "PAYMENT") {
    throw new ApiError(422, "AI extraction returned an unsupported intent.");
  }

  if (!payload.customerName || typeof payload.customerName !== "string") {
    throw new ApiError(422, "Customer name is required.");
  }

  if (intent === "SALE") {
    if (payload.productName !== null && typeof payload.productName !== "string") {
      throw new ApiError(422, "Product name must be a string or null.");
    }

    if (payload.quantity !== null && (typeof payload.quantity !== "number" || !Number.isFinite(payload.quantity) || payload.quantity <= 0)) {
      throw new ApiError(422, "Quantity must be a positive number or null.");
    }

    if (payload.totalAmount !== null && (typeof payload.totalAmount !== "number" || !Number.isFinite(payload.totalAmount) || payload.totalAmount < 0)) {
      throw new ApiError(422, "Total amount must be a non-negative number or null.");
    }
  }

  if (payload.paidAmount !== null && (typeof payload.paidAmount !== "number" || !Number.isFinite(payload.paidAmount) || payload.paidAmount < 0)) {
    throw new ApiError(422, "Paid amount must be a non-negative number or null.");
  }

  return {
    ...payload,
    customerName: payload.customerName.trim(),
    productName: payload.productName ? payload.productName.trim() : null,
    notes: payload.notes ? String(payload.notes).trim() : "",
  };
};

const findCustomerByName = async ({ owner, customerName }) => {
  const customers = await searchCustomers({ owner, keyword: customerName });
  const normalizedName = customerName.trim().toLowerCase();

  const exactMatches = customers.filter((customer) => customer.name?.trim().toLowerCase() === normalizedName);

  if (exactMatches.length > 1) {
    return {
      status: "multiple",
      customers: exactMatches.map((customer) => ({
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      })),
    };
  }

  if (exactMatches.length === 1) {
    return {
      status: "found",
      customer: exactMatches[0],
    };
  }

  if (customers.length === 0) {
    return {
      status: "not_found",
    };
  }

  const fuzzyMatch = customers.find((customer) => {
    const storedName = customer.name?.trim().toLowerCase() || "";
    return storedName.includes(normalizedName) || normalizedName.includes(storedName);
  });

  if (fuzzyMatch) {
    return {
      status: "found",
      customer: fuzzyMatch,
    };
  }

  return {
    status: "multiple",
    customers: customers.map((customer) => ({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    })),
  };
};

const findProductByName = async ({ owner, productName }) => {
  const products = await searchProducts({ owner, keyword: productName });
  const normalizedName = productName.trim().toLowerCase();

  const exactMatch = products.find((product) => product.productName?.trim().toLowerCase() === normalizedName);
  const fuzzyMatch = products.find((product) => {
    const storedName = product.productName?.trim().toLowerCase() || "";
    return storedName.includes(normalizedName) || normalizedName.includes(storedName);
  });
  const product = exactMatch || fuzzyMatch || products[0];

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};

const getFriendlyAiErrorMessage = (error) => {
  const message = error?.message || "";

  if (error?.status === 429 || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
    return "Google AI quota exceeded. Please check your Gemini API billing/plan or wait for the quota to reset.";
  }

  if (error?.status === 401 || message.includes("API key") || message.includes("unauthorized")) {
    return "Invalid or unauthorized Gemini API key.";
  }

  if (error?.status === 400 || message.includes("invalid")) {
    return "The Gemini request was rejected. Please verify the model name and request format.";
  }

  if (message) {
    return message;
  }

  return "Failed to process AI transaction extraction.";
};

export const extractTransactionFromText = async ({ owner, text }) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new ApiError(400, "Text input is required.");
  }

  if (!gemmaConfig.apiKey) {
    throw new ApiError(500, "Gemma API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: gemmaConfig.model,
      contents: `${SYSTEM_PROMPT}\n\nUser message: ${text}`,
    });

    const rawText = response?.text || "";
    const parsed = normalizeJson(rawText);
    const validated = validateExtraction(parsed);

    const customerLookup = await findCustomerByName({ owner, customerName: validated.customerName });

    if (customerLookup.status === "not_found") {
      return {
        success: false,
        code: "CUSTOMER_NOT_FOUND",
        customerName: validated.customerName,
        message: "Customer not found. Please add customer details.",
        data: {
          extracted: validated,
        },
      };
    }

    if (customerLookup.status === "multiple") {
      return {
        success: false,
        code: "MULTIPLE_CUSTOMERS_FOUND",
        customerName: validated.customerName,
        message: "Multiple customers found. Please choose the correct customer.",
        customers: customerLookup.customers,
        data: {
          extracted: validated,
        },
      };
    }

    if (validated.intent === "SALE") {
      const product = await findProductByName({ owner, productName: validated.productName || "" });

      const computedTotalAmount =
        typeof validated.quantity === "number" && validated.quantity > 0 && typeof product?.sellingPrice === "number"
          ? validated.quantity * product.sellingPrice
          : null;

      const normalizedExtraction = {
        ...validated,
        totalAmount: computedTotalAmount ?? validated.totalAmount,
      };

      const transaction = await createSaleTransaction({
        owner,
        customerId: customerLookup.customer._id,
        inventoryId: product._id,
        quantity: validated.quantity || 1,
        paidAmount: validated.paidAmount || 0,
        notes: validated.notes || `AI extracted sale from: ${text}`,
        createdByAI: true,
      });

      return {
        success: true,
        intent: "SALE",
        extracted: normalizedExtraction,
        transaction,
      };
    }

    const payment = await receivePayment({
      owner,
      customerId: customerLookup.customer._id,
      amount: validated.paidAmount || 0,
      notes: validated.notes || `AI extracted payment from: ${text}`,
    });

    return {
      success: true,
      intent: "PAYMENT",
      extracted: validated,
      transaction: payment,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.message?.includes("Not found") || error?.message?.includes("not found")) {
      throw new ApiError(404, error.message);
    }

    throw new ApiError(502, getFriendlyAiErrorMessage(error));
  }
};

export default extractTransactionFromText;
