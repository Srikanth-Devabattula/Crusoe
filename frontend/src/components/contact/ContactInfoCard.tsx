"use client";

import { motion } from "framer-motion";
import {
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { contactInfoBlocks } from "@/data/contactPage";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function ContactInfoCard() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={0.08}
      className="flex h-full flex-col rounded-[32px] border border-[#e7efe0] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <FiUser className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="text-heading text-xl sm:text-2xl">Contact Information</h2>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-4 sm:pt-6">
        <div className="space-y-8">
        {contactInfoBlocks.map((office, index) => (
          <div
            key={office.id}
            className={
              index > 0 ? "border-t border-[#e7efe0] pt-8" : undefined
            }
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-[#111827]">
              {office.title}
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#6B7280]">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <a
                  href={office.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed transition-colors hover:text-brand hover:underline"
                >
                  {office.address}
                </a>
              </li>
              <li>
                <a
                  href={office.tel}
                  className="flex items-center gap-3 text-sm text-[#6B7280] transition-colors hover:text-brand"
                >
                  <FiPhone className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {office.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${office.email}`}
                  className="flex items-center gap-3 text-sm text-[#6B7280] transition-colors hover:text-brand"
                >
                  <FiMail className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {office.email}
                </a>
              </li>
            </ul>
          </div>
        ))}
        </div>

        <div className="mt-10 border-t border-[#e7efe0] pt-8 pb-2">
          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
            <FiClock className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="font-semibold text-[#111827]">Business Hours</p>
              <p className="mt-1">Monday–Friday · 9AM–6PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
