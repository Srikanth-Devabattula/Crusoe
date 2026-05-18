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
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendError(res, 400, "Required fields are missing");
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Placeholder: notify admin via email
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `New Contact: ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
    }).catch(() => {});

    return sendSuccess(res, 201, "Message sent successfully", contact);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { submitContact };
