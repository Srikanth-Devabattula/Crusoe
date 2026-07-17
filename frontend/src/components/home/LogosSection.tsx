"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getPartnerLogoUrl } from "@/lib/uploads";
import { partnerService } from "@/services";
import type { Partner } from "@/types";

function LogoCard({ partner }: { partner: Partner }) {
  const src = getPartnerLogoUrl(partner.logo);
  if (!src) return null;

  const content = (
    <div className="flex h-[88px] w-[180px] shrink-0 items-center justify-center bg-transparent px-5 sm:h-24 sm:w-[210px] lg:h-28 lg:w-[240px]">
      <Image
        src={src}
        alt={partner.name}
        width={200}
        height={80}
        unoptimized={src.startsWith("/api/")}
        className="h-12 w-auto max-w-[150px] object-contain sm:h-14 sm:max-w-[175px] lg:h-16 lg:max-w-[200px]"
      />
    </div>
  );

  if (partner.websiteUrl?.trim()) {
    return (
      <Link
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
      >
        {content}
      </Link>
    );
  }

  return content;
}

function LogoMarqueeSet({
  partners,
  ariaHidden = false,
}: {
  partners: Partner[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 sm:gap-10 lg:gap-12"
      aria-hidden={ariaHidden || undefined}
    >
      {partners.map((partner) => (
        <LogoCard key={partner._id} partner={partner} />
      ))}
    </div>
  );
}

export function LogosSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await partnerService.getPublished();
        if (!cancelled) setPartners(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setPartners([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLoading && partners.length === 0) return null;

  return (
    <section
      id="logos"
      aria-label="Partner logos"
      className="relative overflow-hidden bg-transparent py-6 sm:py-8 lg:py-10"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(126, 168, 73,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center sm:mb-10"
        >
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-muted/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
            Trusted Worldwide
          </span>
          <h2 className="text-heading mt-4 text-2xl sm:text-3xl lg:text-[34px]">
            Companies That{" "}
            <span className="text-brand">Trust Crusoe</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex animate-pulse justify-center gap-8 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 w-36 rounded bg-gray-100 sm:h-16 sm:w-40" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="logos-marquee-viewport overflow-hidden py-2 motion-reduce:hidden">
              <div className="logos-marquee-track flex w-max gap-8 sm:gap-10 lg:gap-12">
                <LogoMarqueeSet partners={partners} />
                <LogoMarqueeSet partners={partners} ariaHidden />
              </div>
            </div>

            <ul className="sr-only">
              {partners.map((partner) => (
                <li key={partner._id}>{partner.name}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {!isLoading && (
          <ul className="mt-2 hidden motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-4">
            {partners.map((partner) => (
              <li key={partner._id}>
                <LogoCard partner={partner} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
