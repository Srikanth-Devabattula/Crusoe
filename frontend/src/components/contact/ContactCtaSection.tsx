"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { ROUTES } from "@/constants";
import { CONTACT_CTA_IMAGE } from "@/data/contactPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

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
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 4.5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function ContactCtaSection() {
  return (
    <section aria-label="Schedule consultation" className="section-padding bg-white pb-16 lg:pb-20">
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-[40px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_50%,#eef8e7_100%)] shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute -bottom-12 left-1/4 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
          <FloatingOrb
            className="absolute left-[12%] top-[20%] h-4 w-4 rounded-full bg-brand/60"
            delay={0}
          />
          <FloatingOrb
            className="absolute right-[28%] top-[15%] h-3 w-3 rounded-full bg-white shadow"
            delay={0.6}
          />
          <FloatingOrb
            className="absolute bottom-[25%] right-[15%] h-5 w-5 rounded-full bg-brand/40"
            delay={1}
          />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_0.9fr] lg:gap-12 lg:px-14">
            <div className="text-center lg:text-left">
              <h2 className="text-heading text-[26px] sm:text-[30px] lg:text-[32px]">
                Ready to Start Your{" "}
                <span className="text-brand">Next Project?</span>
              </h2>
              <p className="text-description mx-auto mt-4 max-w-lg lg:mx-0">
                Tell us about your goals and we&apos;ll help you ship reliable,
                high-quality software with the right engineering approach.
              </p>
              <Link
                href={`${ROUTES.contact}#contact-form`}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-[0_14px_34px_rgba(108,191,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_20px_44px_rgba(108,191,42,0.38)] sm:w-auto"
              >
                Schedule a Consultation
                <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[180px] w-full max-w-[320px] sm:h-[220px] lg:h-[260px] lg:max-w-[380px]">
                <motion.div
                  className="relative h-full w-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={CONTACT_CTA_IMAGE}
                    alt="Start your next project"
                    fill
                    sizes="(max-width: 1024px) 320px, 380px"
                    className="object-contain object-center"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
