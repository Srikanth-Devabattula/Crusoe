"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { CTAButton } from "@/components/hero/CTAButton";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { CONTACT_HERO_IMAGE, WHATSAPP_URL } from "@/data/contactPage";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      aria-hidden
      animate={{ y: [0, -14, 0], opacity: [0.55, 0.9, 0.55] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay>
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#7EA849_1px,transparent_1px)] [background-size:20px_20px]" />
      </PageHeroOverlay>

      <motion.div
        className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.95fr] lg:gap-8 xl:gap-10">
          <motion.div
            className="order-2 text-center lg:order-1 lg:text-left"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>CONTACT US</AnimatedBadge>
            </motion.div>

            <h1 className="text-heading mt-4 text-[28px] leading-[1.12] sm:text-[34px] lg:mt-5 lg:text-[38px] xl:text-[42px]">
              Let&apos;s Build Something
              <br />
              <span className="text-brand">Impactful Together</span>
            </h1>

            <p className="text-description mx-auto mt-3 max-w-lg text-sm sm:text-base lg:mx-0 lg:mt-4">
              Partner with Crusoe Technologies for engineering excellence, quality
              assurance, and software solutions that accelerate your business.
            </p>

            <motion.div
              custom={0.12}
              variants={fadeUp}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <CTAButton href="#contact-form" variant="primary">
                Talk to Experts
              </CTAButton>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-[13px] font-semibold text-brand shadow-sm transition-all duration-300 hover:border-brand/30 hover:bg-brand-muted/40 sm:px-7 sm:py-4 lg:text-xs"
                >
                  <FaWhatsapp className="h-4 w-4 shrink-0" aria-hidden />
                  Chat on WhatsApp
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 flex justify-center lg:order-2 lg:justify-center lg:pl-4 xl:pl-8"
            custom={0.14}
            variants={fadeUp}
          >
            <div className="relative h-[200px] w-full max-w-[420px] sm:h-[220px] md:h-[240px] lg:h-[260px] lg:max-w-[460px] lg:-translate-x-6 xl:h-[280px] xl:-translate-x-10">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
                aria-hidden
              />
              <FloatingOrb
                className="absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-brand shadow-[0_0_12px_rgba(126, 168, 73,0.5)] sm:h-4 sm:w-4"
                delay={0}
              />
              <FloatingOrb
                className="absolute right-[12%] top-[28%] h-5 w-5 rounded-full bg-white shadow-md ring-2 ring-brand/20 sm:h-6 sm:w-6"
                delay={0.8}
              />
              <FloatingOrb
                className="absolute bottom-[22%] left-[18%] h-4 w-4 rounded-full bg-brand/70 sm:h-5 sm:w-5"
                delay={1.2}
              />
              <FloatingOrb
                className="absolute bottom-[30%] right-[8%] h-2.5 w-2.5 rounded-full bg-white/90 shadow sm:h-3 sm:w-3"
                delay={0.4}
              />
              <motion.div
                className="relative h-full w-full"
                // animate={{ y: [0, -10, 0] }}
                // transition={{
                //   duration: 5,
                //   repeat: Infinity,
                //   ease: "easeInOut",
                // }}
              >
                <Image
                  src={CONTACT_HERO_IMAGE}
                  alt="Contact Crusoe Technologies"
                  fill
                  priority
                  sizes="(max-width: 1024px) 85vw, 460px"
                  className="object-contain object-center drop-shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
