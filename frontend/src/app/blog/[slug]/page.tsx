import type { Metadata } from "next";

import { BlogPostView } from "@/components/blog/BlogPostView";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";
import { plainTextExcerpt } from "@/lib/seo";
import { getBlogPrimaryCoverUrl } from "@/lib/uploads";
import { blogService } from "@/services";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const path = ROUTES.blogPost(params.slug);

  try {
    const res = await blogService.getBySlug(params.slug);
    const post = res.data;
    if (!post?.title) {
      throw new Error("Missing post");
    }

    const description =
      post.excerpt?.trim() ||
      plainTextExcerpt(post.content || "", 160) ||
      "Read the latest from Crusoe Tech.";

    return createPageMetadata(post.title, description, {
      path,
      ogImage: getBlogPrimaryCoverUrl(post),
    });
  } catch {
    return createPageMetadata("Article", "Read the latest from Crusoe Tech.", {
      path,
    });
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostView slug={params.slug} />;
}
