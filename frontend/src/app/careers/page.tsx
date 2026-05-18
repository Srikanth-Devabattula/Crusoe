import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Careers",
  "Join our team — view open positions."
);

export default function CareersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Careers"
        description="Build your career with Crusoe Tech."
      />
      <Section title="Open Positions">
        <p className="text-gray-600">Job listings placeholder.</p>
      </Section>
    </PageContainer>
  );
}
