const Partner = require("../models/Partner");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  removeCoverAsset,
  resolveCoverFromRequest,
  validateCoverImageValue,
} = require("../utils/gridfsStorage");

const PARTNER_LOGO_BUCKET = "partner-logos";

const parsePartnerBody = (body) => ({
  name: body.name,
  logo: body.logo,
  websiteUrl: body.websiteUrl,
  published: body.published === true || body.published === "true",
  sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
  removeLogo: body.removeLogo === true || body.removeLogo === "true",
});

const validatePartnerBody = (body, isUpdate = false) => {
  const { name, logo, websiteUrl } = body;

  if (!isUpdate || name !== undefined) {
    if (!name || !String(name).trim()) return "Company name is required";
  }

  if (!isUpdate || logo !== undefined) {
    if (!isUpdate && (!logo || !String(logo).trim())) return "Logo is required";
    if (logo) {
      const logoError = validateCoverImageValue(logo);
      if (logoError) return logoError;
    }
  }

  if (websiteUrl !== undefined && websiteUrl && !/^https?:\/\/.+/i.test(String(websiteUrl))) {
    return "Website URL must be a valid https URL";
  }

  return null;
};

const sanitizePartnerBody = (body) => {
  const payload = {};

  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.logo !== undefined) payload.logo = String(body.logo).trim();
  if (body.websiteUrl !== undefined) payload.websiteUrl = String(body.websiteUrl).trim();
  if (body.published !== undefined) payload.published = Boolean(body.published);
  if (body.sortOrder !== undefined) payload.sortOrder = Number(body.sortOrder) || 0;

  return payload;
};

const getPartners = async (req, res) => {
  const items = await Partner.find().sort({ sortOrder: 1, createdAt: -1 });
  return sendSuccess(res, 200, "Partners retrieved", items);
};

const getPublishedPartners = async (req, res) => {
  const items = await Partner.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 });
  return sendSuccess(res, 200, "Published partners retrieved", items);
};

const createPartner = async (req, res) => {
  const body = parsePartnerBody(req.body);
  req.body.coverImage = req.body.logo;
  req.body.removeCoverImage = req.body.removeLogo;
  const logo = await resolveCoverFromRequest(req, PARTNER_LOGO_BUCKET, null, null);
  if (logo.value !== undefined) body.logo = logo.value;

  const error = validatePartnerBody(body);
  if (error) return sendError(res, 400, error);

  const item = await Partner.create(sanitizePartnerBody(body));
  return sendSuccess(res, 201, "Partner created", item);
};

const updatePartner = async (req, res) => {
  const existing = await Partner.findById(req.params.id);
  if (!existing) return sendError(res, 404, "Partner not found");

  const body = parsePartnerBody(req.body);
  req.body.coverImage = req.body.logo;
  req.body.removeCoverImage = req.body.removeLogo;
  const logo = await resolveCoverFromRequest(req, PARTNER_LOGO_BUCKET, null, existing.logo);
  if (logo.value !== undefined) body.logo = logo.value;
  if (body.removeLogo) body.logo = "";

  const error = validatePartnerBody(body, true);
  if (error) return sendError(res, 400, error);

  const payload = sanitizePartnerBody(body);

  if (logo.value !== undefined && logo.previous && logo.previous !== logo.value) {
    await removeCoverAsset(logo.previous, PARTNER_LOGO_BUCKET, null);
  }
  if (body.removeLogo && existing.logo) {
    await removeCoverAsset(existing.logo, PARTNER_LOGO_BUCKET, null);
  }

  const item = await Partner.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, "Partner updated", item);
};

const deletePartner = async (req, res) => {
  const item = await Partner.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 404, "Partner not found");

  if (item.logo) {
    await removeCoverAsset(item.logo, PARTNER_LOGO_BUCKET, null);
  }

  return sendSuccess(res, 200, "Partner deleted");
};

module.exports = {
  getPartners,
  getPublishedPartners,
  createPartner,
  updatePartner,
  deletePartner,
};
