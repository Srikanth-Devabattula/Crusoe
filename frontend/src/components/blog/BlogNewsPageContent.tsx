"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { AnimatedBadge } from "@/components/common/AnimatedBadge";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";
import { BlogListing } from "@/components/blog/BlogListing";
import {
  BlogNewsTabSwitch,
  type BlogNewsTab,
} from "@/components/blog/BlogNewsTabSwitch";
import { NewsListing } from "@/components/news/NewsListing";
import { ROUTES } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const tabCopy: Record<
  BlogNewsTab,
  { badge: string; title: string; description: string }
> = {
  blog: {
    badge: "OUR BLOG",
    title: "Insights, stories & updates",
    description:
      "Explore articles on technology, engineering, and how we build products that matter.",
  },
  news: {
    badge: "COMPANY NEWS",
    title: "Latest news & announcements",
    description:
      "Stay up to date with company updates, press releases, and industry news from Crusoe Tech.",
  },
};

function parseTab(value: string | null): BlogNewsTab {
  return value === "news" ? "news" : "blog";
}

export function BlogNewsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<BlogNewsTab>(() =>
    parseTab(searchParams.get("tab"))
  );

  useEffect(() => {
    setActiveTab(parseTab(searchParams.get("tab")));
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tab: BlogNewsTab) => {
      setActiveTab(tab);
      const nextUrl =
        tab === "news" ? `${ROUTES.blog}?tab=news` : ROUTES.blog;
      router.replace(nextUrl, { scroll: false });
    },
    [router]
  );

  const copy = tabCopy[activeTab];

  return (
    <>
      <section className="relative overflow-hidden bg-transparent">
        <PageHeroOverlay />

        <motion.div
          className="hero-container relative z-10 pb-8 pt-[5.25rem] sm:pb-10 sm:pt-[5.75rem] lg:pb-12 lg:pt-[6.25rem]"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mx-auto max-w-3xl text-center"
            custom={0.08}
            variants={fadeUp}
          >
            <motion.div custom={0.05} variants={fadeUp}>
              <AnimatedBadge>Blogs &amp; News</AnimatedBadge>
            </motion.div>

            <motion.h1
              className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]"
              custom={0.12}
              variants={fadeUp}
            >
              {copy.title}
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
              custom={0.18}
              variants={fadeUp}
            >
              {copy.description}
            </motion.p>

            <motion.div custom={0.24} variants={fadeUp}>
              <BlogNewsTabSwitch
                active={activeTab}
                onChange={handleTabChange}
                className="mt-8 sm:mt-10"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <div role="tabpanel" aria-label={activeTab === "blog" ? "Blog articles" : "News articles"}>
        {activeTab === "blog" ? <BlogListing /> : <NewsListing />}
      </div>
    </>
  );
}
