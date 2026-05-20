import { NewsHero } from "@/components/news/NewsHero";
import { NewsListing } from "@/components/news/NewsListing";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "News",
  "Company news and announcements from Crusoe Tech."
);

export default function NewsPage() {
  return (
    <>
      <NewsHero />
      <NewsListing />
    </>
  );
}
