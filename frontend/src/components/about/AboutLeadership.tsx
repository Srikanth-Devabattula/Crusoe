"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

import { getTeamPhotoUrl } from "@/lib/uploads";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { teamService } from "@/services";
import type { TeamMember } from "@/types";

export function AboutLeadership() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await teamService.getPublished();
        if (!cancelled) setTeam(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setTeam([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="leadership"
      aria-label="Leadership"
      className="section-padding scroll-mt-24 bg-transparent"
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

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-[32px] bg-gray-50" />
            ))}
          </div>
        ) : team.length === 0 ? null : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {team.map((member, index) => {
              const photoSrc = getTeamPhotoUrl(member.photo);
              const linkedIn = member.linkedIn?.trim() || "#";
              const twitter = member.twitter?.trim() || "#";
              const email = member.email?.trim() || "mailto:info@crusoetec.com";
              const emailHref = email.startsWith("mailto:") ? email : `mailto:${email}`;

              return (
                <motion.article
                  key={member._id}
                  variants={fadeUp}
                  custom={index * 0.06}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-[32px] border border-[#e7efe0] bg-white p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-shadow hover:border-brand/25 hover:shadow-[0_16px_48px_rgba(126,168,73,0.12)] sm:p-6"
                >
                  <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">
                    {photoSrc ? (
                      <Image
                        src={photoSrc}
                        alt={member.name}
                        fill
                        sizes="128px"
                        unoptimized={photoSrc.startsWith("/api/")}
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#111827]">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-brand">{member.role}</p>
                  {member.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{member.bio}</p>
                  )}
                  <div className="mt-5 flex items-center justify-center gap-2">
                    {member.linkedIn && (
                      <Link
                        href={linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                      >
                        <FaLinkedinIn className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    {member.twitter && (
                      <Link
                        href={twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on Twitter`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                      >
                        <FaTwitter className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <Link
                      href={emailHref}
                      aria-label={`Email ${member.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                    >
                      <FiMail className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
