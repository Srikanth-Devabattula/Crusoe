import type { Metadata } from "next";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Crusoe Tech — professional technology solutions.",
};

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Welcome to Crusoe Tech"
        description="Professional technology solutions for your business."
      />
      <Section title="Hero Section">
        <p className="text-gray-600">
          Homepage content placeholder. Hero, features, and CTA sections will be
          implemented here.
        </p>
      </Section>
      <Section title="Featured Services">
        <p className="text-gray-600">Services preview placeholder.</p>
      </Section>
    </PageContainer>
  );
}
