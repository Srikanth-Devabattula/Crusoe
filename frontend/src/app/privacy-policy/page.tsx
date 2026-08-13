import Link from "next/link";

import { PageContainer } from "@/components/common/PageContainer";
import { ROUTES, SITE_NAME } from "@/constants";
import { privacyPolicyContent } from "@/data/privacyPolicy";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Privacy Policy",
  `Learn how ${SITE_NAME} collects, uses, and protects your personal information.`,
  { path: ROUTES.privacyPolicy }
);

export default function PrivacyPolicyPage() {
  const { title, lastUpdated, intro, contactNote, sections } =
    privacyPolicyContent;

  return (
    <div className="bg-transparent pt-[5.25rem] sm:pt-[5.75rem] lg:pt-[6.25rem]">
      <PageContainer className="pb-16 sm:pb-20">
        <header className="mx-auto max-w-3xl border-b border-[#e7efe0] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Legal
          </p>
          <h1 className="text-heading mt-3 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-5 text-base leading-relaxed text-[#4b5563]">
            {intro}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-3 text-sm leading-relaxed text-[#4b5563] sm:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
              {"bullets" in section && section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4b5563] sm:text-[15px]">
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <p className="rounded-2xl border border-[#e7efe0] bg-[#f8fbf4] px-5 py-4 text-sm leading-relaxed text-[#4b5563]">
            {contactNote}
          </p>

          <Link
            href={ROUTES.contact}
            className="inline-flex text-sm font-semibold text-brand hover:underline"
          >
            Contact us →
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
