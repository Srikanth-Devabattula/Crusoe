export function toDateInputValue(iso?: string | null): string {
  const fallback = new Date().toISOString().slice(0, 10);
  if (!iso) return fallback;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toISOString().slice(0, 10);
}

export function dateInputToIso(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toISOString();
}

export function getPublishDisplayDate(item: {
  publishedAt?: string | null;
  createdAt: string;
}): string {
  return item.publishedAt || item.createdAt;
}
