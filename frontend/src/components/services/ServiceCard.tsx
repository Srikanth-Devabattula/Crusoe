"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { ROUTES } from "@/constants";
import type { ServiceItem } from "@/data/servicesPage";
import { fadeUp } from "@/lib/motion";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const { bgColor, accentColor } = service;

  return (
    <motion.article
      custom={index * 0.08}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -5 }}
      style={
        {
          backgroundColor: bgColor,
          ["--service-accent" as string]: accentColor,
        } as CSSProperties
      }
      className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/90 shadow-[0_8px_32px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(15,23,42,0.1)]"
    >
      <div className="grid h-full flex-1 grid-cols-1 items-center gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,38%)_1fr] md:gap-6 lg:p-6 xl:gap-7 xl:p-7">
        <div className="relative flex min-h-[160px] items-center justify-center md:min-h-[180px] xl:min-h-[200px]">
          <div className="relative h-[150px] w-full max-w-[260px] md:h-[160px] md:max-w-none xl:h-[180px]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 400px"
              className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <h3 className="text-heading text-[22px] leading-tight sm:text-[24px] xl:text-[26px]">
            {service.title}
          </h3>

          <p className="mt-2.5 text-[13px] leading-relaxed text-[#5b6472] sm:text-sm xl:text-[15px]">
            {service.description}
          </p>

          <ul className="mt-4 flex flex-col gap-2.5 xl:mt-5 xl:gap-3">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-[13px] font-medium text-[#374151] sm:text-sm"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white xl:h-7 xl:w-7"
                  style={{ borderColor: `${accentColor}59` }}
                >
                  <Check
                    className="h-3.5 w-3.5 xl:h-4 xl:w-4"
                    style={{ color: accentColor }}
                    strokeWidth={2.5}
                  />
                </span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href={ROUTES.contact}
            className="group/link mt-5 inline-flex w-fit items-center gap-2.5 text-[15px] font-semibold text-[color:var(--service-accent)] transition-colors duration-300 xl:mt-6"
          >
            Learn More
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[color:var(--service-accent)] bg-white text-[color:var(--service-accent)] transition-all duration-300 group-hover/link:bg-[color:var(--service-accent)] group-hover/link:text-white xl:h-9 xl:w-9">
              <ArrowRight className="h-3.5 w-3.5 xl:h-4 xl:w-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
