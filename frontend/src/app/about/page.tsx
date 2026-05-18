import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "About",
  "Learn about Crusoe Tech and our mission."
);

export default function AboutPage() {
  return (
    <PageContainer>
      <PageHeader title="About Us" description="Who we are and what we do." />
      <Section title="Our Story">
        <p className="text-gray-600">Company story content placeholder.</p>
      </Section>
      <Section title="Our Team">
        <p className="text-gray-600">Team section placeholder.</p>
      </Section>
    </PageContainer>
  );
}
