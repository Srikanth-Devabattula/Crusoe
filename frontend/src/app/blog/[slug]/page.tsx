import { BlogPostView } from "@/components/blog/BlogPostView";
import { createPageMetadata } from "@/lib/createPageMetadata";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BlogPostPageProps) {
  return createPageMetadata("Article", "Read the latest from Crusoe Tech.");
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostView slug={params.slug} />;
}
