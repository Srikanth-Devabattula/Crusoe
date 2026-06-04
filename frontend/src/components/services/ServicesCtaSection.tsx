"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/constants";
import { SERVICES_CTA_IMAGE } from "@/data/servicesPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function ServicesCtaSection() {
  return (
    <section aria-label="Project inquiry" className="section-padding bg-transparent pb-16 lg:pb-20">
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-[28px] border border-[#e7efe0] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf2_50%,#eef8e7_100%)] shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute -bottom-12 left-1/4 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-12 lg:px-14">
            <div className="relative flex justify-center pl-4 sm:pl-8 lg:justify-center lg:pl-12 xl:pl-16">
              <div className="relative h-[180px] w-full max-w-[320px] sm:h-[220px] lg:h-[260px] lg:max-w-[380px] lg:translate-x-4 xl:translate-x-8">
                <Image
                  src={SERVICES_CTA_IMAGE}
                  alt="Start a conversation illustration"
                  fill
                  sizes="(max-width: 1024px) 320px, 380px"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                LET&apos;S WORK TOGETHER
              </p>
              <h2 className="text-heading mt-3 text-[26px] sm:text-[30px] lg:text-[32px]">
                Have a Project in Mind?
              </h2>
              <p className="text-description mx-auto mt-4 max-w-lg lg:mx-0">
                Tell us about your goals and we&apos;ll help you ship reliable,
                high-quality software with the right engineering approach.
              </p>
              <Link
                href={ROUTES.contact}
                className="group mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-[0_14px_34px_rgba(126, 168, 73,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_20px_44px_rgba(126, 168, 73,0.38)]"
              >
                Start a Conversation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
