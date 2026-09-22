"use client";

import {
  looksLikeHtml,
  plainTextToEditorHtml,
  prepareArticleHtmlForDisplay,
  sanitizeArticleHtml,
} from "@/lib/htmlContent";
import { cn } from "@/lib/cn";

type ArticleRichContentProps = {
  content: string;
  className?: string;
  paragraphClassName?: string;
};

export function ArticleRichContent({
  content,
  className,
  paragraphClassName,
}: ArticleRichContentProps) {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const normalized = prepareArticleHtmlForDisplay(trimmed);
  const htmlCandidate = looksLikeHtml(normalized)
    ? normalized
    : plainTextToEditorHtml(normalized);

  if (looksLikeHtml(htmlCandidate)) {
    return (
      <div
        className={cn("article-rich-content", className)}
        dangerouslySetInnerHTML={{
          __html: sanitizeArticleHtml(htmlCandidate),
        }}
      />
    );
  }

  return (
    <>
      {normalized.split("\n").map((paragraph, index) =>
        paragraph.trim() ? (
          <p
            key={index}
            className={cn(
              "mb-5 break-words text-base leading-relaxed text-slate-700 sm:text-lg",
              paragraphClassName
            )}
          >
            {paragraph}
          </p>
        ) : (
          <br key={index} />
        )
      )}
    </>
  );
}
