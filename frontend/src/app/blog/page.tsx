import { Suspense } from "react";

import { BlogNewsPageContent } from "@/components/blog/BlogNewsPageContent";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Blogs & News",
  "Insights, articles, and company news from Crusoe Tech.",
  { path: ROUTES.blog }
);

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="hero-container py-24 text-center text-sm text-slate-500">
          Loading…
        </div>
      }
    >
      <BlogNewsPageContent />
    </Suspense>
  );
}
