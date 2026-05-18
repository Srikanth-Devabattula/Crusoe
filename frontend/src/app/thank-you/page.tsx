import Link from "next/link";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Thank You",
  "Thank you for contacting Crusoe Tech."
);

export default function ThankYouPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Thank You"
        description="Your submission has been received."
      />
      <p className="text-gray-600">
        We will get back to you shortly. This is a confirmation page placeholder.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-6 inline-block text-sm font-medium text-gray-900 underline"
      >
        Return to homepage
      </Link>
    </PageContainer>
  );
}
