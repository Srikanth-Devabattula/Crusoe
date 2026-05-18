const nodemailer = require("nodemailer");

/**
 * Nodemailer transporter placeholder — configure when SMTP credentials are ready
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email helper — extend with templates as needed
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  };

  // Placeholder: log in development until SMTP is configured
  if (process.env.NODE_ENV !== "production") {
    console.log("[Mail] Email queued:", { to, subject });
  }

  return transporter.sendMail(mailOptions);
};

module.exports = { createTransporter, sendEmail };
