import { BlogHero } from "@/components/blog/BlogHero";
import { BlogListing } from "@/components/blog/BlogListing";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Blog",
  "Insights, articles, and updates from Crusoe Tech."
);

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogListing />
    </>
  );
}
