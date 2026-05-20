import { CareersHero } from "@/components/careers/CareersHero";
import { CareersJobsList } from "@/components/careers/CareersJobsList";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Careers",
  "Join our team — explore open positions at Crusoe Tech."
);

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersJobsList />
    </>
  );
}
