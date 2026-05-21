"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { contactOffices } from "@/data/contactPage";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { OfficeMapEmbed } from "./OfficeMapEmbed";

export function ContactOfficesSection() {
  return (
    <section aria-label="Our offices" className="section-padding bg-white">
      <div className="hero-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-heading text-2xl sm:text-3xl lg:text-[34px]">
            Our Offices
          </h2>
          <p className="text-description mx-auto mt-3 max-w-lg">
            We are present in two key locations to serve you better.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10"
        >
          {contactOffices.map((office, index) => (
            <motion.article
              key={office.id}
              variants={fadeUp}
              custom={index * 0.08}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-[32px] border border-[#e7efe0] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(108,191,42,0.1)] sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-brand" aria-hidden />
                <h3 className="text-sm font-bold text-[#111827]">{office.title}</h3>
              </div>

              <OfficeMapEmbed embedUrl={office.embedUrl} title={office.title} />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-[#6B7280]">{office.address}</p>
                <Link
                  href={office.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Get Directions
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
