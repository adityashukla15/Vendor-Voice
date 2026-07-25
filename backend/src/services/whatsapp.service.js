import Customer from "../models/customer.model.js";
import ApiError from "../utils/apiError.js";

const buildReminderMessage = ({ customerName, shopName, outstandingAmount }) => {
  const amount = Number(outstandingAmount || 0);

  if (amount <= 100) {
    return `Hello ${customerName} 👋\n\nThis is a friendly reminder that your pending balance at ${shopName} is ₹${amount}.\n\nKindly clear the payment whenever convenient.\n\nThank you.`;
  }

  return `Hello ${customerName} 👋\n\nThis is a polite reminder that your outstanding balance at ${shopName} is ₹${amount}.\n\nKindly clear the payment at your earliest convenience.\n\nThank you.`;
};

export const generateWhatsAppReminder = async ({ owner, customerId, shopName = "Vendor Voice" }) => {
  const customer = await Customer.findOne({
    _id: customerId,
    owner,
    isActive: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }

  if (!customer.phone) {
    throw new ApiError(400, "Customer phone number is required.");
  }

  if (!customer.outstandingBalance || customer.outstandingBalance <= 0) {
    throw new ApiError(400, "Customer has no outstanding balance.");
  }

  const message = buildReminderMessage({
    customerName: customer.name,
    shopName,
    outstandingAmount: customer.outstandingBalance,
  });

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/91${customer.phone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;

  return {
    link: whatsappLink,
    message,
  };
};
