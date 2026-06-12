"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

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
      whileHover={{ y: -3 }}
      style={
        {
          backgroundColor: bgColor,
          ["--service-accent" as string]: accentColor,
        } as CSSProperties
      }
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-white/90 shadow-[0_4px_18px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:rounded-[18px] lg:min-h-[180px] lg:flex-row lg:rounded-[16px] xl:min-h-[200px] xl:rounded-[18px] desktop:min-h-[220px] desktop:rounded-[20px] 2xl:min-h-[240px]"
    >
      <div className="relative aspect-[16/11] w-full shrink-0 sm:aspect-[5/3] lg:aspect-auto lg:h-auto lg:min-h-[180px] lg:w-[36%] xl:min-h-[200px] xl:w-[38%] desktop:min-h-[220px] desktop:w-[40%] 2xl:min-h-[240px] 2xl:w-[40%]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3.5 py-3.5 sm:px-4 sm:py-4 lg:px-3 lg:py-3 xl:px-3.5 xl:py-3.5 desktop:px-4 desktop:py-4 2xl:px-5 2xl:py-4">
        <h3 className="text-heading text-[15px] leading-tight sm:text-[16px] lg:text-[14px] xl:text-[15px] desktop:text-[16px] 2xl:text-[17px]">
          {service.title}
        </h3>

        <p className="mt-1 text-[11px] leading-snug text-[#5b6472] sm:mt-1.5 sm:text-[12px] lg:mt-1 lg:text-[10px] lg:leading-[1.4] xl:text-[14px] xl:leading-[1.5]">
          {service.description}
        </p>

        <ul className="mt-2 flex flex-col gap-1 sm:mt-2.5 sm:gap-1.5 lg:mt-1.5 lg:gap-0.5 xl:mt-2 xl:gap-1.5 desktop:mt-2.5 desktop:gap-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#374151] sm:text-[12px] lg:text-[9.5px] lg:leading-tight xl:text-[14px]"
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white sm:h-[18px] sm:w-[18px] lg:h-4 lg:w-4 xl:h-[17px] xl:w-[17px] desktop:h-[18px] desktop:w-[18px] 2xl:h-5 2xl:w-5"
                style={{ borderColor: `${accentColor}59` }}
              >
                <Check
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-2 lg:w-2 xl:h-2.5 xl:w-2.5 desktop:h-3 desktop:w-3 2xl:h-3 2xl:w-3"
                  style={{ color: accentColor }}
                  strokeWidth={2.5}
                />
              </span>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={service.href}
          className="group/link mt-2.5 inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-[color:var(--service-accent)] transition-colors duration-300 sm:mt-3 sm:text-[13px] lg:mt-2 lg:text-[11px] xl:mt-2.5 xl:text-[14px]"
        >
          Learn More
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[color:var(--service-accent)] bg-white text-[color:var(--service-accent)] transition-all duration-300 group-hover/link:bg-[color:var(--service-accent)] group-hover/link:text-white sm:h-6 sm:w-6 lg:h-5 lg:w-5 xl:h-[22px] xl:w-[22px] desktop:h-6 desktop:w-6">
            <ArrowRight
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-2.5 lg:w-2.5 xl:h-3 xl:w-3 desktop:h-3 desktop:w-3"
              strokeWidth={2.5}
            />
          </span>
        </Link>
      </div>
    </motion.article>
  );
}
