"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Engineering Services",
    description:
      "Advanced engineering solutions focused on product innovation, system optimization and scalable technology implementation for modern businesses.",
    image: "/images/services/service-1.png",
  },
  {
    title: "Software Development",
    description:
      "Custom software applications built with modern technologies to deliver secure, scalable and high-performance digital experiences.",
    image: "/images/services/service-2.png",
  },
  {
    title: "Software QA",
    description:
      "Comprehensive quality assurance and automated testing services to ensure reliability, performance and seamless user experiences.",
    image: "/images/services/service-3.png",
  },
  {
    title: "CAD Testing",
    description:
      "Specialized CAD validation and testing services designed to improve design accuracy, workflow efficiency and manufacturing quality.",
    image: "/images/services/service-4.png",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function OurServicesSection() {
  return (
    <section
      id="our-services"
      aria-label="Our services"
      className="relative overflow-hidden bg-[#f7f9fc] py-16 sm:py-20 lg:py-24"
    >
      {/* dotted background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="hero-container relative z-10">
        {/* top content */}
        <div className="grid gap-10 lg:grid-cols-1 lg:gap-8 desktop:grid-cols-[1fr_minmax(0,360px)] desktop:items-start desktop:gap-12 xl:grid-cols-[1fr_420px] xl:gap-16">
          {/* left heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-base font-bold uppercase tracking-[0.12em] text-brand sm:text-lg lg:text-sm desktop:text-lg xl:text-xl">
              Our Services
            </p>

            <h2 className="text-heading mt-4 max-w-[720px] text-[32px] leading-[1.08] sm:text-[44px] lg:text-[28px] lg:leading-[1.12] desktop:text-[34px] xl:text-[46px] 2xl:text-[50px]">
              Solutions That Drive
              <br />
              <span className="text-brand">Quality and Innovation</span>
            </h2>
          </motion.div>

          {/* right text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.08}
            className="lg:max-w-none desktop:pt-2 xl:pt-4"
          >
            <p className="max-w-[420px] text-[15px] leading-[1.75] text-[#4b5563] lg:max-w-none desktop:text-[16px] xl:text-[17px] xl:leading-[2]">
              We combine deep domain expertise with modern engineering
              practices to deliver high-quality solutions tailored to your
              business needs.
            </p>

            <Link
              href="/services"
              className="group mt-7 inline-flex items-center gap-3 text-[17px] font-semibold text-brand transition-all duration-300 hover:gap-4"
            >
              View All Services

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index * 0.08}
              variants={fadeUp}
              whileHover={{
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#edf2e7] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-brand/20 hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
            >
              {/* glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,191,42,0.05),transparent_68%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* image */}
              <div className="relative overflow-hidden rounded-[22px] bg-[#f6f8f2]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(108,191,42,0.06),transparent_70%)]" />

                <Image
                  src={service.image}
                  alt={service.title}
                  width={500}
                  height={500}
                  className="relative z-10 h-[220px] w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              {/* content */}
              <div className="relative z-10 flex flex-1 flex-col pt-6">
                <h3 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#0f172a]">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 text-[16px] leading-[1.95] text-[#4b5563]">
                  {service.description}
                </p>

                {/* button */}
                <Link
                  href="/services"
                  className="group/link mt-7 inline-flex items-center gap-3 text-[16px] font-semibold text-brand"
                >
                  Learn More

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}