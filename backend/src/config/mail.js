const nodemailer = require("nodemailer");

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email via SMTP (required in all environments, including local dev).
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env"
    );
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { createTransporter, sendEmail, isSmtpConfigured };
