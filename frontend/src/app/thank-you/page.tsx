import Link from "next/link";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Thank You",
  "Thank you for contacting Crusoe Tech."
);

interface ThankYouPageProps {
  searchParams: { type?: string };
}

export default function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const isApplication = searchParams.type === "application";

  return (
    <PageContainer>
      <PageHeader
        title="Thank You"
        description={
          isApplication
            ? "Your application has been received."
            : "Your submission has been received."
        }
      />
      <p className="text-gray-600">
        {isApplication
          ? "Our team will review your application and get back to you if your profile is a match for this role."
          : "We will get back to you shortly."}
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
        {isApplication && (
          <Link href={ROUTES.careers} className="text-brand underline hover:no-underline">
            View more positions
          </Link>
        )}
        <Link href={ROUTES.home} className="text-gray-900 underline">
          Return to homepage
        </Link>
      </div>
    </PageContainer>
  );
}
