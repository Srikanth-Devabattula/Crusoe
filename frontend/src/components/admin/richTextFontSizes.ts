export const RICH_TEXT_FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
] as const;

export type RichTextFontSize = (typeof RICH_TEXT_FONT_SIZES)[number];

export function parseFontSizePx(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d+(?:\.\d+)?)px$/i);
  if (!match) return null;
  return Number(match[1]);
}

export function stepRichTextFontSize(
  current: string | null | undefined,
  direction: "up" | "down"
): RichTextFontSize {
  const px = parseFontSizePx(current) ?? 16;
  let index = RICH_TEXT_FONT_SIZES.findIndex(
    (size) => parseFontSizePx(size)! >= px
  );
  if (index === -1) index = RICH_TEXT_FONT_SIZES.length - 1;

  if (direction === "up") {
    return RICH_TEXT_FONT_SIZES[
      Math.min(RICH_TEXT_FONT_SIZES.length - 1, index + 1)
    ];
  }

  return RICH_TEXT_FONT_SIZES[Math.max(0, index - 1)];
}
