"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

import { cultureFeatures, cultureImages } from "@/data/aboutPage";
import { cn } from "@/lib/cn";
import { fadeUp, viewportOnce } from "@/lib/motion";

function CulturePhotoTile({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative min-h-0 overflow-hidden rounded-2xl border border-[#e7efe0]/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:rounded-3xl",
        className
      )}
    >
      <div className="relative h-full w-full min-h-[72px] overflow-hidden rounded-2xl sm:rounded-3xl">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    </motion.div>
  );
}

export function AboutCulture() {
  const [tall, wide, bottomLeft, bottomRight] = cultureImages;

  return (
    <section aria-label="Our culture" className="section-padding bg-[#F7F9F4]">
      <div className="hero-container">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:gap-6 xl:gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0}
              className="lg:pr-2"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
                OUR CULTURE
              </p>
              <h2 className="text-heading mt-3 text-2xl leading-tight sm:text-3xl lg:text-[32px] xl:text-[34px]">
                People First.{" "}
                <span className="text-brand">Innovation Always.</span>
              </h2>
              <p className="text-description mt-4 max-w-lg text-sm leading-relaxed sm:text-[15px]">
                We foster a culture where engineers, designers, and consultants
                collaborate openly — learning continuously, delivering with integrity,
                and celebrating together with our global partners.
              </p>
              <ul className="mt-6 space-y-3.5 sm:mt-7 sm:space-y-4">
                {cultureFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <FiCheckCircle className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-[#111827] sm:text-[15px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.08}
              className="w-full lg:pl-0"
            >
              <div className="grid h-[300px] w-full min-w-0 grid-cols-3 grid-rows-2 gap-3 sm:h-[340px] sm:gap-3.5 lg:h-[400px] lg:gap-4 xl:h-[440px] 2xl:h-[480px]">
                <CulturePhotoTile
                  src={tall}
                  alt="Team collaborating around data and charts"
                  sizes="(max-width: 1024px) 55vw, 420px"
                  className="row-span-2"
                />
                <CulturePhotoTile
                  src={wide}
                  alt="Team brainstorming with sticky notes"
                  sizes="(max-width: 1024px) 85vw, 560px"
                  className="col-span-2"
                />
                <CulturePhotoTile
                  src={bottomLeft}
                  alt="Professional working with headset and laptop"
                  sizes="(max-width: 1024px) 28vw, 220px"
                />
                <CulturePhotoTile
                  src={bottomRight}
                  alt="Business handshake with city skyline"
                  sizes="(max-width: 1024px) 28vw, 220px"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
