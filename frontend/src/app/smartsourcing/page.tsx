import { SmartSourcingHero, SmartSourcingDetails } from "@/components/smartsourcing";
import { ROUTES } from "@/constants";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "SmartSourcing",
  "Beyond Outsourcing: Elevating Innovation with Crusoe Technologies SmartSourcing Model.",
  { path: ROUTES.smartsourcing }
);

export default function SmartSourcingPage() {
  return (
    <>
      <SmartSourcingHero />
      <SmartSourcingDetails />
    </>
  );
}
