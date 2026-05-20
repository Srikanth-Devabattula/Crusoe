/** Only these emails may access the admin panel */
const ADMIN_EMAILS = [
  "srikanthdevabathula@gmail.com",
  "srikanth01107@gmail.com",
];

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const isAdminEmail = (email) =>
  ADMIN_EMAILS.map(normalizeEmail).includes(normalizeEmail(email));

module.exports = { ADMIN_EMAILS, normalizeEmail, isAdminEmail };
