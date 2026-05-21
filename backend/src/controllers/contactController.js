const Contact = require("../models/Contact");
const { sendEmail } = require("../config/mail");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, service, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendError(res, 400, "Required fields are missing");
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    const contact = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : "",
      company: company ? String(company).trim() : "",
      service: service ? String(service).trim() : "",
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    const details = [
      company ? `Company: ${company}` : null,
      service ? `Service: ${service}` : null,
      phone ? `Phone: ${phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `New Contact: ${subject}`,
      text: `From: ${name} (${email})\n${details ? `${details}\n\n` : ""}${message}`,
    }).catch(() => {});

    return sendSuccess(res, 201, "Message sent successfully", contact);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   GET /api/contact/admin
 * @desc    List all contact submissions (admin)
 * @access  Admin
 */
const getAdminContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Contacts retrieved", contacts);
};

/**
 * @route   PATCH /api/contact/:id/status
 * @desc    Update contact status (admin)
 * @access  Admin
 */
const updateContactStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["new", "read", "replied"];

  if (!status || !allowed.includes(status)) {
    return sendError(res, 400, "Invalid status");
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return sendError(res, 404, "Contact not found");
  }

  return sendSuccess(res, 200, "Status updated", contact);
};

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact submission (admin)
 * @access  Admin
 */
const deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return sendError(res, 404, "Contact not found");
  }

  return sendSuccess(res, 200, "Contact deleted");
};

/**
 * @route   POST /api/contact/admin/bulk-delete
 * @desc    Delete multiple contact submissions (admin)
 * @access  Admin
 */
const deleteContactsBulk = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return sendError(res, 400, "ids array is required");
  }

  const result = await Contact.deleteMany({ _id: { $in: ids } });

  return sendSuccess(res, 200, "Contacts deleted", {
    deletedCount: result.deletedCount,
  });
};

module.exports = {
  submitContact,
  getAdminContacts,
  updateContactStatus,
  deleteContact,
  deleteContactsBulk,
};
