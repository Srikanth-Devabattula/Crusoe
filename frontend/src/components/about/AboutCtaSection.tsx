"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { ROUTES } from "@/constants";
import { ABOUT_IMAGE } from "@/data/aboutPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

import { FloatingOrb } from "./AboutDecor";

export function AboutCtaSection() {
  return (
    <section aria-label="Get started" className="section-padding bg-white pb-16 lg:pb-20">
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
            className="absolute left-[10%] top-[22%] h-4 w-4 rounded-full bg-brand/60"
          />
          <FloatingOrb
            className="absolute right-[20%] top-[18%] h-3 w-3 rounded-full bg-white shadow"
            delay={0.5}
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:gap-7 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-12 xl:max-w-7xl">
            <div className="w-full max-w-md text-center lg:max-w-lg lg:shrink-0 lg:text-left">
              <h2 className="text-heading text-[26px] sm:text-[30px] lg:text-[32px]">
                Ready to Build with <span className="text-brand">Crusoe</span>?
              </h2>
              <p className="text-description mx-auto mt-4 max-w-lg lg:mx-0">
                Let&apos;s collaborate to turn your ideas into powerful products and
                long-term success.
              </p>
              <Link
                href={ROUTES.contact}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-[0_14px_34px_rgba(108,191,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_20px_44px_rgba(108,191,42,0.38)] sm:w-auto"
              >
                Start a Conversation
                <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="relative flex shrink-0 justify-center lg:justify-end">
              <div className="relative h-[220px] w-[min(100%,340px)] sm:h-[260px] sm:w-[400px] lg:h-[300px] lg:w-[460px] xl:h-[340px] xl:w-[520px]">
                <motion.div
                  className="relative h-full w-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={ABOUT_IMAGE}
                    alt="Build with Crusoe"
                    fill
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 520px"
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
