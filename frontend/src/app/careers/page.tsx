import { AboutCulture } from "@/components/about/AboutCulture";
import { CareersHero } from "@/components/careers/CareersHero";
import { CareersJobsList } from "@/components/careers/CareersJobsList";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Careers",
  "Join our team — explore open positions at Crusoe Tech.",
  { path: ROUTES.careers }
);

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersJobsList />
      <AboutCulture />
    </>
  );
}
