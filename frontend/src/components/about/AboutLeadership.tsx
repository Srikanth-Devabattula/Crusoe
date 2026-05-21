"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

import { ABOUT_IMAGE, leadershipTeam } from "@/data/aboutPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function AboutLeadership() {
  return (
    <section
      id="leadership"
      aria-label="Leadership"
      className="section-padding scroll-mt-24 bg-white"
    >
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            LEADERSHIP
          </p>
          <h2 className="text-heading mt-3 text-2xl sm:text-3xl lg:text-[34px]">
            Driven by Experienced Leadership
          </h2>
          <p className="text-description mx-auto mt-4 max-w-2xl">
            Our leadership team brings together deep domain expertise, technical
            innovation, and a shared commitment to excellence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {leadershipTeam.map((member, index) => (
            <motion.article
              key={member.name}
              variants={fadeUp}
              custom={index * 0.06}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[32px] border border-[#e7efe0] bg-white p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-shadow hover:border-brand/25 hover:shadow-[0_16px_48px_rgba(108,191,42,0.12)] sm:p-6"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                <Image
                  src={ABOUT_IMAGE}
                  alt={member.name}
                  fill
                  sizes="128px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#111827]">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-brand">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{member.bio}</p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <Link
                  href="#"
                  aria-label={`${member.name} on LinkedIn`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FaLinkedinIn className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="#"
                  aria-label={`${member.name} on Twitter`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FaTwitter className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="mailto:info@crusoetec.com"
                  aria-label={`Email ${member.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FiMail className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
