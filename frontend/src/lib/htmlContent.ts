import DOMPurify from "isomorphic-dompurify";

const ARTICLE_HTML_ALLOWED = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "blockquote",
    "a",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "span",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "style",
    "class",
    "colspan",
    "rowspan",
    "src",
    "alt",
    "title",
    "width",
    "height",
    "loading",
  ],
  ALLOWED_STYLES: {
    "*": {
      "text-align": /^(left|right|center|justify)$/,
      "font-size": /^\d+(?:\.\d+)?(px|em|rem|%|pt)$/,
    },
  },
};

export function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content.trim());
}

export function plainTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function isFullHtmlDocument(html: string): boolean {
  return /^\s*(?:<!DOCTYPE[\s\S]*?>\s*)?<html[\s>]/i.test(html);
}

/** Fix pasted docs, literal HTML-in-text, and localhost image URLs before render. */
export function prepareArticleHtmlForDisplay(html: string): string {
  let prepared = html.trim();
  if (!prepared) return "";

  if (/&lt;(html|body|img|table|p|ul|ol)/i.test(prepared)) {
    prepared = decodeHtmlEntities(prepared);
  }

  // Only unwrap a full pasted document — not inline <body> inside table markup (<tbody>).
  if (isFullHtmlDocument(prepared)) {
    const bodyMatch = prepared.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch?.[1]) {
      prepared = bodyMatch[1];
    }
    prepared = prepared
      .replace(/<\/?html\b[^>]*>/gi, "")
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
      .replace(/<\/?body\b[^>]*>/gi, "");
  }

  prepared = prepared.replace(
    /https?:\/\/(?:localhost|127\.0\.0\.1):\d+(\/api\/files\/[^"'>\s]+)/gi,
    "$1"
  );
  prepared = prepared.replace(
    /https?:\/\/[^/"'\s>]+\/(api\/files\/[^"'>\s]+)/gi,
    "/$1"
  );

  prepared = prepared.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/gi, "$1");

  // Paragraph that only contains a pasted html/body/img wrapper
  prepared = prepared.replace(
    /<p>\s*(?:<html\b[^>]*>\s*)?(?:<body\b[^>]*>\s*)?(<img[^>]*>)\s*(?:<\/body>\s*)?(?:<\/html>\s*)?<\/p>/gi,
    "$1"
  );

  return prepared.trim();
}

export function sanitizeArticleHtml(html: string): string {
  const prepared = prepareArticleHtmlForDisplay(html);
  return DOMPurify.sanitize(prepared, ARTICLE_HTML_ALLOWED);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert legacy plain-text posts for the rich text editor. */
export function plainTextToEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";
  if (looksLikeHtml(trimmed)) return prepareArticleHtmlForDisplay(trimmed);

  const blocks = trimmed
    .split(/\n\s*\n+/)
    .map((block) => block.replace(/\n+/g, " ").trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return `<p>${escapeHtml(trimmed)}</p>`;
  }

  return blocks.map((block) => `<p>${escapeHtml(block)}</p>`).join("");
}
