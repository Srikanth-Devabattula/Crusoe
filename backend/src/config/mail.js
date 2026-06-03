const nodemailer = require("nodemailer");

const trim = (value) => (typeof value === "string" ? value.trim() : "");

const getSmtpPass = () => trim(process.env.SMTP_PASS).replace(/\s/g, "");

const isSmtpConfigured = () =>
  Boolean(trim(process.env.SMTP_HOST) && trim(process.env.SMTP_USER) && getSmtpPass());

const createTransporter = () => {
  const host = trim(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: trim(process.env.SMTP_USER),
      pass: getSmtpPass(),
    },
    requireTLS: !secure && port === 587,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
    },
  });
};

const getFromAddress = () => {
  const from = trim(process.env.SMTP_FROM);
  if (from) return from;
  return trim(process.env.SMTP_USER);
};

/**
 * Send email via SMTP (required in all environments, including local dev).
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in environment variables."
    );
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Used by health checks — does not send mail.
 */
const verifySmtpConnection = async () => {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP environment variables are missing" };
  }

  const transporter = createTransporter();
  await transporter.verify();
  return { ok: true };
};

module.exports = {
  createTransporter,
  sendEmail,
  isSmtpConfigured,
  verifySmtpConnection,
};
