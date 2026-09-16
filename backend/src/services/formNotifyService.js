const path = require("path");
const { sendEmail, getNotifyEmail, isEmailConfigured } = require("../config/mail");

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const row = (label, value) =>
  value
    ? `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111827">${escapeHtml(value)}</td></tr>`
    : "";

const wrapHtml = (title, rows, footer) => `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827">
    <h2 style="color:#4d7c0f;margin:0 0 16px">${escapeHtml(title)}</h2>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px">
      ${rows}
    </table>
    ${footer ? `<p style="margin-top:16px;color:#6b7280;font-size:13px">${footer}</p>` : ""}
  </div>
`;

const notifyContactSubmission = async (contact) => {
  if (!isEmailConfigured()) return;

  const to = getNotifyEmail();
  if (!to) return;

  const { name, email, phone, company, service, subject, message } = contact;

  const rows = [
    row("Name", name),
    row("Email", email),
    row("Phone", phone),
    row("Company", company),
    row("Service", service),
    row("Subject", subject),
    `<tr><td colspan="2" style="padding:12px"><strong style="color:#374151">Message</strong><pre style="margin:8px 0 0;white-space:pre-wrap;font-family:inherit;color:#111827">${escapeHtml(message)}</pre></td></tr>`,
  ].join("");

  const textLines = [
    `New contact form submission`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    service ? `Service: ${service}` : null,
    `Subject: ${subject}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  await sendEmail({
    to,
    subject: `New contact enquiry: ${subject}`,
    html: wrapHtml("New contact form submission", rows),
    text: textLines,
  });
};

const notifyJobApplication = async ({ application, job, resumeFile }) => {
  if (!isEmailConfigured()) return;

  const to = getNotifyEmail();
  if (!to) return;

  const jobTitle = job?.title || "Unknown position";
  const { name, email, phone, message } = application;

  const rows = [
    row("Name", name),
    row("Email", email),
    row("Phone", phone),
    row("Position", jobTitle),
    row("Location", job?.location),
    row("Experience required", job?.experience),
    message
      ? `<tr><td colspan="2" style="padding:12px"><strong style="color:#374151">Message</strong><pre style="margin:8px 0 0;white-space:pre-wrap;font-family:inherit;color:#111827">${escapeHtml(message)}</pre></td></tr>`
      : "",
  ].join("");

  const textLines = [
    `New job application`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Position: ${jobTitle}`,
    job?.location ? `Location: ${job.location}` : null,
    job?.experience ? `Experience: ${job.experience}` : null,
    message ? `\nMessage:\n${message}` : null,
    resumeFile ? `\nResume attached: ${resumeFile.originalname || resumeFile.filename}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const attachments = resumeFile
    ? [
        {
          filename: resumeFile.originalname || resumeFile.filename,
          path: path.join(__dirname, "..", "uploads", "resumes", resumeFile.filename),
        },
      ]
    : undefined;

  await sendEmail({
    to,
    subject: `New job application: ${name} — ${jobTitle}`,
    html: wrapHtml("New job application", rows, "Resume is attached to this email."),
    text: textLines,
    attachments,
  });
};

const notifyGeneralApplication = async ({ application, resumeFile }) => {
  if (!isEmailConfigured()) return;

  const to = getNotifyEmail();
  if (!to) return;

  const { name, email, phone, message } = application;

  const rows = [
    row("Name", name),
    row("Email", email),
    row("Phone", phone),
    row("Type", "General application"),
    message
      ? `<tr><td colspan="2" style="padding:12px"><strong style="color:#374151">Message</strong><pre style="margin:8px 0 0;white-space:pre-wrap;font-family:inherit;color:#111827">${escapeHtml(message)}</pre></td></tr>`
      : "",
  ].join("");

  const textLines = [
    `New general application`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    message ? `\nMessage:\n${message}` : null,
    resumeFile ? `\nResume attached: ${resumeFile.originalname || resumeFile.filename}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const attachments = resumeFile
    ? [
        {
          filename: resumeFile.originalname || resumeFile.filename,
          path: path.join(__dirname, "..", "uploads", "resumes", resumeFile.filename),
        },
      ]
    : undefined;

  await sendEmail({
    to,
    subject: `New general application: ${name}`,
    html: wrapHtml("New general application", rows, "Resume is attached to this email."),
    text: textLines,
    attachments,
  });
};

module.exports = {
  notifyContactSubmission,
  notifyJobApplication,
  notifyGeneralApplication,
};
