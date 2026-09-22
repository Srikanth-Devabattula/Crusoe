function extractBodyHtml(html: string): string {
  if (!/^\s*(?:<!DOCTYPE[\s\S]*?>\s*)?<html[\s>]/i.test(html)) {
    return html;
  }
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch?.[1]) return bodyMatch[1];
  return html;
}

/** Strip common Word / Google Docs noise before TipTap parses pasted HTML. */
export function cleanPastedHtml(html: string): string {
  let cleaned = extractBodyHtml(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)o:p[^>]*>/gi, "<$1p>")
    .replace(/<(\/?)w:[^>]+>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/ class="Mso[^"]*"/gi, "")
    .replace(/ style="mso-[^"]*"/gi, "")
    .replace(/\sstyle="\s*"/gi, "");

  // Unwrap single-child spans that only carry formatting (keep bold etc. on inner tags)
  cleaned = cleaned.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, (match, inner) => {
    if (/mso-|font-family:|font-size:/i.test(match)) return inner;
    return match;
  });

  cleaned = cleaned
    .replace(/<\/?html\b[^>]*>/gi, "")
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?body\b[^>]*>/gi, "");

  return cleaned.trim();
}
