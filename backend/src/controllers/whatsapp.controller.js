import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { generateWhatsAppReminder } from "../services/whatsapp.service.js";

export const sendWhatsAppReminder = asyncHandler(async (req, res) => {
  const { customerId, shopName } = req.body;

  const result = await generateWhatsAppReminder({
    owner: req.user._id,
    customerId,
    shopName,
  });

  return successResponse(res, 200, "WhatsApp reminder generated successfully.", {
    link: result.link,
  });
});

export default sendWhatsAppReminder;
