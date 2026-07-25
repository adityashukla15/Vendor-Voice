import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { successResponse } from "../utils/response.js";
import { extractTransactionFromText } from "../services/ai.service.js";

export const processVoice = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    throw new ApiError(400, "Voice text is required.");
  }

  const result = await extractTransactionFromText({
    owner: req.user._id,
    text,
  });

  if (result?.success === false) {
    return res.status(200).json(result);
  }

  return successResponse(res, 200, "Voice processed successfully.", result);
});

export default processVoice;