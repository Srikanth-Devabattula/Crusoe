import { NewsArticleView } from "@/components/news/NewsArticleView";
import { createPageMetadata } from "@/lib/createPageMetadata";

interface NewsArticlePageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: NewsArticlePageProps) {
  return createPageMetadata("News", "Read the latest company news from Crusoe Tech.");
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  return <NewsArticleView slug={params.slug} />;
}
