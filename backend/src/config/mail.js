const fs = require("fs");
const nodemailer = require("nodemailer");

const trim = (value) => (typeof value === "string" ? value.trim() : "");

const getSmtpPass = () => trim(process.env.SMTP_PASS).replace(/\s/g, "");

const isResendConfigured = () => Boolean(trim(process.env.RESEND_API_KEY));

const isSmtpConfigured = () =>
  Boolean(trim(process.env.SMTP_HOST) && trim(process.env.SMTP_USER) && getSmtpPass());

const isEmailConfigured = () => isResendConfigured() || isSmtpConfigured();

const getEmailProvider = () => {
  if (isResendConfigured()) return "resend";
  if (isSmtpConfigured()) return "smtp";
  return "none";
};

/** Normalize "Name <email@x.com>" → email@x.com for SMTP */
const getFromAddress = () => {
  const from = trim(process.env.RESEND_FROM) || trim(process.env.SMTP_FROM);
  if (from) {
    const match = from.match(/<([^>]+)>/);
    return match ? trim(match[1]) : from;
  }
  return trim(process.env.SMTP_USER);
};

/** Inbox for contact form and job application notifications */
const getNotifyEmail = () =>
  trim(process.env.NOTIFY_EMAIL) || trim(process.env.SMTP_USER);

const getResendFrom = () => {
  const from = trim(process.env.RESEND_FROM);
  if (from) return from;
  const email = getFromAddress();
  return email ? `Crusoe Technologies <${email}>` : "Crusoe Technologies <onboarding@resend.dev>";
};

const createTransporter = () => {
  const host = trim(process.env.SMTP_HOST);
  let port = Number(process.env.SMTP_PORT) || 587;

  if (process.env.NODE_ENV === "production" && !process.env.SMTP_PORT) {
    port = 465;
  }

  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

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
    family: 4,
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
    },
  });
};

const sendViaResend = async ({ to, subject, html, text, attachments }) => {
  const apiKey = trim(process.env.RESEND_API_KEY);
  const payload = {
    from: getResendFrom(),
    to: [to],
    subject,
    html,
    text,
  };

  if (attachments?.length) {
    payload.attachments = attachments.map((file) => ({
      filename: file.filename,
      content: file.content,
    }));
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = body?.message || body?.error || response.statusText;
    throw new Error(`Resend email failed: ${detail}`);
  }

  return body;
};

const sendViaSmtp = async ({ to, subject, html, text, attachments }) => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: trim(process.env.SMTP_FROM) || getFromAddress(),
    to,
    subject,
    html,
    text,
    attachments,
  });
};

/**
 * Send email — prefers Resend API on Render (set RESEND_API_KEY), else SMTP.
 */
const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const normalizedAttachments = attachments?.map((file) => {
    if (file.content) return file;
    if (file.path && fs.existsSync(file.path)) {
      return {
        filename: file.filename,
        content: fs.readFileSync(file.path).toString("base64"),
      };
    }
    return null;
  }).filter(Boolean);

  if (isResendConfigured()) {
    return sendViaResend({ to, subject, html, text, attachments: normalizedAttachments });
  }

  if (!isSmtpConfigured()) {
    throw new Error(
      "Email is not configured. Set RESEND_API_KEY (recommended on Render) or SMTP_HOST, SMTP_USER, and SMTP_PASS."
    );
  }

  const smtpAttachments = attachments?.map((file) =>
    file.path ? { filename: file.filename, path: file.path } : file
  );

  return sendViaSmtp({ to, subject, html, text, attachments: smtpAttachments });
};

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
  isResendConfigured,
  isEmailConfigured,
  getEmailProvider,
  getNotifyEmail,
  verifySmtpConnection,
};
