export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearchQuery(
  query: string,
  values: Array<string | undefined | null>
): boolean {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;

  return values.some((value) => value?.toLowerCase().includes(normalized));
}
