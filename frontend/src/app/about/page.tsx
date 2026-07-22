import {
  AboutCoreValues,
  AboutCtaSection,
  AboutCulture,
  AboutHero,
  AboutLeadership,
  AboutMissionVision,
  AboutStorySection,
  AboutTimeline,
} from "@/components/about";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "About Us",
  "Engineering innovation driven by passion — learn about Crusoe Technologies, our mission, leadership, and journey since 2015.",
  { path: ROUTES.about }
);

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStorySection />
      <AboutMissionVision />
      <AboutLeadership />
      <AboutCoreValues />
      <AboutTimeline />
      <AboutCulture />
      {/* <AboutCtaSection /> */}
    </>
  );
}
