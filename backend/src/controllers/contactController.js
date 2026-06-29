const Contact = require("../models/Contact");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { notifyContactSubmission } = require("../services/formNotifyService");

const CONTACT_STATUSES = ["new", "read", "replied"];

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

    await notifyContactSubmission(contact).catch((err) => {
      console.error("Contact notification email failed:", err.message);
    });

    return sendSuccess(res, 201, "Message sent successfully", contact);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   GET /api/contact
 * @desc    List contact submissions
 * @access  Private (contacts permission)
 */
const getContacts = async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Contact submissions retrieved", items);
};

/**
 * @route   PATCH /api/contact/:id
 * @desc    Update contact submission status
 * @access  Private (contacts permission)
 */
const updateContact = async (req, res) => {
  const { status } = req.body;

  if (status !== undefined && !CONTACT_STATUSES.includes(status)) {
    return sendError(res, 400, "Invalid status");
  }

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return sendError(res, 404, "Contact submission not found");
  }

  if (status !== undefined) contact.status = status;
  await contact.save();

  return sendSuccess(res, 200, "Contact submission updated", contact);
};

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact submission
 * @access  Private (contacts permission)
 */
const deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return sendError(res, 404, "Contact submission not found");
  }

  return sendSuccess(res, 200, "Contact submission deleted");
};

module.exports = {
  submitContact,
  getContacts,
  updateContact,
  deleteContact,
};
