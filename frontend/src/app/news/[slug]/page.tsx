import type { Metadata } from "next";

import { NewsArticleView } from "@/components/news/NewsArticleView";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";
import { plainTextExcerpt } from "@/lib/seo";
import { getNewsPrimaryCoverUrl } from "@/lib/uploads";
import { newsService } from "@/services";

interface NewsArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const path = ROUTES.newsArticle(params.slug);

  try {
    const res = await newsService.getBySlug(params.slug);
    const article = res.data;
    if (!article?.title) {
      throw new Error("Missing article");
    }

    const description =
      article.excerpt?.trim() ||
      plainTextExcerpt(article.content || "", 160) ||
      "Read the latest company news from Crusoe Tech.";

    return createPageMetadata(article.title, description, {
      path,
      ogImage: getNewsPrimaryCoverUrl(article),
    });
  } catch {
    return createPageMetadata(
      "News",
      "Read the latest company news from Crusoe Tech.",
      { path }
    );
  }
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  return <NewsArticleView slug={params.slug} />;
}
