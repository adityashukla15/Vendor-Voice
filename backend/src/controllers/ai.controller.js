import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/response.js";

import { processVendorVoice } from "../services/ai.service.js";

export const processVoice = asyncHandler(async (req, res) => {

  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Voice text is required.");
  }

  const result = await processVendorVoice(text);

  return successResponse(
    res,
    200,
    "Voice processed successfully.",
    result
  );

});