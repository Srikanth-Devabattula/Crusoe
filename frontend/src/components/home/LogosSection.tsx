"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { PARTNER_LOGOS } from "@/data/partnerLogos";

function LogoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-[72px] w-[148px] shrink-0 items-center justify-center bg-transparent px-5 sm:h-20 sm:w-[172px]">
      <Image
        src={src}
        alt={alt}
        width={160}
        height={64}
        className="h-10 w-auto max-w-[120px] object-contain sm:h-12 sm:max-w-[140px]"
      />
    </div>
  );
}

function LogoMarqueeSet({
  ariaHidden = false,
}: {
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 sm:gap-10 lg:gap-12"
      aria-hidden={ariaHidden || undefined}
    >
      {PARTNER_LOGOS.map((logo) => (
        <LogoCard key={logo.src} src={logo.src} alt={logo.alt} />
      ))}
    </div>
  );
}

export function LogosSection() {
  return (
    <section
      id="logos"
      aria-label="Partner logos"
      className="relative overflow-hidden bg-transparent py-10 sm:py-12 lg:py-14"
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="logos-marquee-viewport overflow-hidden py-2 motion-reduce:hidden">
            <div className="logos-marquee-track flex w-max gap-8 sm:gap-10 lg:gap-12">
              <LogoMarqueeSet />
              <LogoMarqueeSet ariaHidden />
            </div>
          </div>

          <ul className="sr-only">
            {PARTNER_LOGOS.map((logo) => (
              <li key={logo.src}>{logo.alt}</li>
            ))}
          </ul>
        </motion.div>

        <ul className="mt-2 hidden motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-4">
          {PARTNER_LOGOS.map((logo) => (
            <li key={logo.src}>
              <LogoCard src={logo.src} alt={logo.alt} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
