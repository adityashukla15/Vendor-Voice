import { createTransporter } from "../config/mail.js";

/**
 * Generic Email Sender
 *
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 */

export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Vendor Voice" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};