import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "News",
  "Company news and announcements."
);

export default function NewsPage() {
  return (
    <PageContainer>
      <PageHeader title="News" description="Latest company news and updates." />
      <Section title="News Feed">
        <p className="text-gray-600">News articles placeholder.</p>
      </Section>
    </PageContainer>
  );
}
