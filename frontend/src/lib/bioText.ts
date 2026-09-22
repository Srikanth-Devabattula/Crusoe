/** Split admin bio textarea into paragraphs (blank lines or single line breaks). */
export function splitBioParagraphs(bio: string): string[] {
  const normalized = bio.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const byBlankLine = normalized
    .split(/\n\s*\n+/)
    .map((block) => block.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (byBlankLine.length > 1) return byBlankLine;

  const single = byBlankLine[0] ?? normalized;
  if (!single.includes("\n")) return [single.replace(/\s+/g, " ").trim()];

  return single
    .split(/\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}
