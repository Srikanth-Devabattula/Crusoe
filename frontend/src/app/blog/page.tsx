import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Blog",
  "Insights, articles, and updates from Crusoe Tech."
);

export default function BlogPage() {
  return (
    <PageContainer>
      <PageHeader title="Blog" description="Latest articles and insights." />
      <Section title="Recent Posts">
        <p className="text-gray-600">Blog posts list placeholder.</p>
      </Section>
    </PageContainer>
  );
}
