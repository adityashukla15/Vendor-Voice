import nodemailer from "nodemailer";

/**
 * Create transporter only when needed
 * (ensures environment variables are already loaded)
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
port: Number(process.env.MAIL_PORT),
secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Verify SMTP Connection
 */
const verifyMailConnection = async () => {
  try {
    const transporter = createTransporter();

    await transporter.verify();

    console.log("✅ Mail Server Connected Successfully");
  } catch (error) {
    console.error("❌ Mail Server Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export { createTransporter, verifyMailConnection };