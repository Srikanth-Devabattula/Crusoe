"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Zap, ShieldCheck, RefreshCw, Compass } from "lucide-react";
import { DottedPattern, FloatingOrb } from "@/components/about/AboutDecor";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function SmartSourcingDetails() {
  return (
    <>
      {/* What is SmartSourcing */}
      <section id="what-is-smartsourcing" className="section-padding relative overflow-hidden bg-transparent pt-8 pb-12 sm:pb-16 lg:pb-20">
        <DottedPattern className="opacity-[0.04]" />
        <FloatingOrb className="absolute right-[5%] top-[10%] h-4 w-4 bg-brand/35" delay={0.2} />
        
        <div className="hero-container relative z-10">
          <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Image Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.08}
              className="relative flex items-center justify-center lg:mt-0"
            >
              <div className="relative w-full max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#f6fbf2_0%,#ffffff_100%)] p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-4 lg:p-5">
                  <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] bg-white">
                    <Image
                      src="/images/stock/ss.jpg"
                      alt="What is SmartSourcing"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-contain object-center bg-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="flex flex-col justify-center"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  EMPOWERMENT & FOCUS
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={0.05}
                className="text-heading mt-4 text-left text-2xl font-bold leading-tight sm:text-3xl lg:text-[32px] xl:text-[36px]"
              >
                What is SmartSourcing?
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="text-description mt-4 text-left text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                It is important to understand that SmartSourcing is not equivalent to traditional outsourcing. While outsourcing focuses primarily on achieving cost benefits, the primary objective of SmartSourcing is to empower your company to focus on its core competencies.
              </motion.p>

              {/* Pillars Grid */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                
                {/* Bullet 1 */}
                <motion.div
                  variants={fadeUp}
                  custom={0.15}
                  className="rounded-2xl border border-[#e7efe0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">Focus on Innovation</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                    By handling technical complexities, we free your team to innovate.
                  </p>
                </motion.div>

                {/* Bullet 2 */}
                <motion.div
                  variants={fadeUp}
                  custom={0.2}
                  className="rounded-2xl border border-[#e7efe0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">Secondary Benefits</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                    While the focus is on empowerment, you still reap the secondary advantages of time and cost benefits.
                  </p>
                </motion.div>

                {/* Bullet 3 */}
                <motion.div
                  variants={fadeUp}
                  custom={0.25}
                  className="rounded-2xl border border-[#e7efe0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">Seamless Collaboration</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                    Using secure collaboration technologies, we protect data integrity and confidentiality through encryption and granular access controls.
                  </p>
                </motion.div>

                {/* Bullet 4 */}
                <motion.div
                  variants={fadeUp}
                  custom={0.3}
                  className="rounded-2xl border border-[#e7efe0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">Location Agility</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                    Our tech stack makes it irrelevant whether we work from your office or ours; the result has always unlocked unparalleled levels of efficiency and accuracy.
                  </p>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Choose Crusoe Technologies */}
      <section id="why-choose-crusoe" className="section-padding relative overflow-hidden bg-transparent py-12 sm:py-16 lg:py-20 border-t border-[#e7efe0]/80">
        <DottedPattern className="opacity-[0.03]" />
        <FloatingOrb className="absolute left-[8%] bottom-[12%] h-3.5 w-3.5 bg-brand/30" delay={0.4} />

        <div className="hero-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Content Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.12}
              className="flex flex-col justify-center"
            >
              <div>
                <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  OUR EXPERIENCE
                </span>
              </div>

              <h2 className="text-heading mt-4 text-left text-2xl font-bold leading-tight sm:text-3xl lg:text-[32px] xl:text-[36px]">
                Why Choose Crusoe Technologies?
              </h2>

              <div className="relative mt-6 overflow-hidden rounded-2xl border border-brand/20 bg-white/70 p-6 backdrop-blur shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-8">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-brand" aria-hidden />
                
                <p className="text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-relaxed">
                  Our leadership brings three decades of experience working with top CAD software companies. This deep-seated industry knowledge allows us to understand your specific business dynamics and provide unrivaled techno-functional expertise. This background helps us formulate a smooth transition plan tailored specifically for your organization.
                </p>
              </div>
            </motion.div>

            {/* Right Image Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              custom={0.08}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-[32px] border border-[#e7efe0] bg-[linear-gradient(145deg,#f6fbf2_0%,#ffffff_100%)] p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-4 lg:p-5">
                  <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[20px] sm:rounded-[24px]">
                    <Image
                      src="/images/stock/ss1.jpg"
                      alt="Why Choose Crusoe Technologies"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Our Core Service Offerings */}
      <section id="offerings" className="section-padding relative overflow-hidden bg-[linear-gradient(180deg,#transparent_0%,#fcfdfa_60%,#f6faf0_100%)] py-12 sm:py-16 lg:py-20 border-t border-[#e7efe0]/80">
        <DottedPattern className="opacity-[0.03]" />
        
        <div className="hero-container relative z-10">
          
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
              OUR SERVICE UMBRELLA
            </span>
            <h2 className="text-heading mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-[36px] xl:text-[40px]">
              Our Core Service Offerings
            </h2>
            <p className="text-description mx-auto mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              We provide a comprehensive suite of services under the SmartSourcing umbrella to ensure your technical assets are world-class:
            </p>
          </div>

          {/* Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            
            {/* Card 1 */}
            <motion.article
              variants={fadeUp}
              custom={0}
              className="relative flex flex-col rounded-3xl border border-[#e7efe0] bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.04)] sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand/10 text-brand">
                <RefreshCw className="h-6 w-6" />
              </div>
              
              <h3 className="text-heading mt-5 text-lg font-bold text-gray-900 sm:text-xl">
                1. CAD Platform Migration
              </h3>
              
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                We simplify the complex process of migration to ensure rapid productivity and maximum ROI.
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3.5 border-t border-slate-100 pt-5 text-left text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Strategic Planning:</strong> Thorough study of current setups to create detailed timelines.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Data Transfer:</strong> Expertise in migrating critical customer data from CAD, PDM, and PLM systems.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Business Continuity:</strong> We ensure uninterrupted operations through rigorous system testing and stakeholder communication.
                  </span>
                </li>
              </ul>
            </motion.article>

            {/* Card 2 */}
            <motion.article
              variants={fadeUp}
              custom={0.06}
              className="relative flex flex-col rounded-3xl border border-[#e7efe0] bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.04)] sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand/10 text-brand">
                <Compass className="h-6 w-6" />
              </div>
              
              <h3 className="text-heading mt-5 text-lg font-bold text-gray-900 sm:text-xl">
                2. Advanced CAD Design Services
              </h3>
              
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Utilizing Onshape CAD experts, we deliver high-quality technical assets:
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3.5 border-t border-slate-100 pt-5 text-left text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Complex Modeling:</strong> Specialized 3D geometry and intricate assembly configurations.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Conceptual Design:</strong> Reference designs for consumer and engineering products used in sales and marketing.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Product Configurators:</strong> Building digital configurators in Onshape to showcase products effectively on digital platforms.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Custom Libraries:</strong> Development of custom component libraries similar to Onshape’s Standard Content library.
                  </span>
                </li>
              </ul>
            </motion.article>

            {/* Card 3 */}
            <motion.article
              variants={fadeUp}
              custom={0.12}
              className="relative flex flex-col rounded-3xl border border-[#e7efe0] bg-white p-6 shadow-[0_12px_45px_rgba(15,23,42,0.04)] sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand/10 text-brand">
                <ShieldCheck className="h-6 w-6" />
              </div>
              
              <h3 className="text-heading mt-5 text-lg font-bold text-gray-900 sm:text-xl">
                3. Software Testing & QA
              </h3>
              
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                We have built a Product Excellence framework based on vast experience with products like Solidworks and Onshape.
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3.5 border-t border-slate-100 pt-5 text-left text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Visualize Beyond:</strong> We don't just find errors; we identify probable causes, adding significant value to the QA process.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Comprehensive Testing:</strong> We cover UI/UX, Integration, Functional, and Release testing.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <strong>Mobile & Peripherals:</strong> Thorough testing for iOS and Android 3D design apps, as well as integration testing for hardware like 3D mice and styluses.
                  </span>
                </li>
              </ul>
            </motion.article>

          </motion.div>
        </div>
      </section>

      {/* The Crusoe Standard */}
      <section id="crusoe-standard" className="section-padding relative overflow-hidden bg-[#EFF4F9] py-12 sm:py-16 lg:py-20 border-t border-[#e7efe0]/80">
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="hero-container relative z-10">
          
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
              OUR GOVERNING PILLARS
            </span>
            <h2 className="text-heading mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-[36px] xl:text-[40px]">
              The Crusoe Standard
            </h2>
            <p className="text-description mx-auto mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Every project we undertake is governed by five pillars:
            </p>
          </div>

          {/* Pillars List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
          >
            {[
              { num: "01", name: "Quick delivery" },
              { num: "02", name: "Highest quality standards" },
              { num: "03", name: "Reliability" },
              { num: "04", name: "Transparency" },
              { num: "05", name: "Control" },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.num}
                variants={fadeUp}
                custom={index * 0.05}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e7efe0] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="pointer-events-none absolute -right-4 -top-4 text-6xl font-black text-slate-50 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.07]"
                  aria-hidden
                >
                  {pillar.num}
                </div>
                <span className="text-2xl font-black text-brand/20 transition-colors duration-300 group-hover:text-brand/40">
                  {pillar.num}
                </span>
                <h4 className="mt-8 text-sm font-bold text-gray-900 sm:text-base leading-snug group-hover:text-brand transition-colors duration-300">
                  {pillar.name}
                </h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
