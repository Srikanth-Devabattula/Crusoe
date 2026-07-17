function parsePublishedAt(value) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { error: "Publish date is invalid" };
  }

  return { value: date };
}

function applyPublishedAt(payload, body, existing) {
  const parsed = parsePublishedAt(body.publishedAt);
  if (parsed && parsed.error) return parsed;

  if (parsed !== undefined) {
    payload.publishedAt = parsed?.value ?? null;
    return null;
  }

  if (body.published && !existing?.publishedAt) {
    payload.publishedAt = new Date();
  }

  return null;
}

module.exports = {
  parsePublishedAt,
  applyPublishedAt,
};
