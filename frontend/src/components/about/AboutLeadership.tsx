"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiMail, FiX } from "react-icons/fi";

import { splitBioParagraphs } from "@/lib/bioText";
import { getTeamPhotoUrl } from "@/lib/uploads";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { teamService } from "@/services";
import type { TeamMember } from "@/types";

function hasSocialLink(value?: string) {
  const trimmed = value?.trim();
  return Boolean(trimmed && trimmed !== "#");
}

function TeamMemberModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  const photoSrc = getTeamPhotoUrl(member.photo);
  const linkedIn = member.linkedIn?.trim();
  const twitter = member.twitter?.trim();
  const email = member.email?.trim();
  const emailHref = email
    ? email.startsWith("mailto:")
      ? email
      : `mailto:${email}`
    : null;

  const showSocial =
    hasSocialLink(linkedIn) || hasSocialLink(twitter) || Boolean(emailHref);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-name"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#e7efe0] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.18)] sm:max-w-3xl sm:p-8 lg:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand/30 hover:text-brand"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-gray-100">
            {photoSrc ? (
              <Image
                src={photoSrc}
                alt={member.name}
                fill
                sizes="128px"
                unoptimized={photoSrc.startsWith("/api/")}
                className="object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-brand">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          <h3
            id="team-member-name"
            className="mt-5 text-xl font-bold text-[#111827] sm:text-2xl"
          >
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-brand sm:text-base">
            {member.role}
          </p>

          {member.bio?.trim() ? (
            <div className="mt-5 w-full space-y-4">
              {splitBioParagraphs(member.bio).map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-justify text-sm leading-relaxed text-[#6B7280] sm:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {showSocial ? (
            <div className="mt-6 flex items-center justify-center gap-2">
              {hasSocialLink(linkedIn) && (
                <Link
                  href={linkedIn!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </Link>
              )}
              {hasSocialLink(twitter) && (
                <Link
                  href={twitter!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on Twitter`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FaTwitter className="h-4 w-4" />
                </Link>
              )}
              {emailHref ? (
                <Link
                  href={emailHref}
                  aria-label={`Email ${member.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-[#6B7280] transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <FiMail className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AboutLeadership() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const closeModal = useCallback(() => setSelectedMember(null), []);

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
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[280px] animate-pulse rounded-[32px] bg-gray-50" />
            ))}
          </div>
        ) : team.length === 0 ? null : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {team.map((member, index) => {
              const photoSrc = getTeamPhotoUrl(member.photo);

              return (
                <motion.button
                  key={member._id}
                  type="button"
                  variants={fadeUp}
                  custom={index * 0.06}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedMember(member)}
                  className="group flex h-full min-h-[280px] w-full flex-col items-center rounded-[32px] border border-[#e7efe0] bg-white p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-shadow hover:border-brand/25 hover:shadow-[0_16px_48px_rgba(126,168,73,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:min-h-[300px] sm:p-6"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">
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
                  <div className="mt-5 flex flex-1 flex-col items-center justify-start">
                    <h3 className="text-lg font-bold leading-snug text-[#111827]">
                      {member.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm font-semibold leading-snug text-brand">
                      {member.role}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {selectedMember ? (
        <TeamMemberModal member={selectedMember} onClose={closeModal} />
      ) : null}
    </section>
  );
}
